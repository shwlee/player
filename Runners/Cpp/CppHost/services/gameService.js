const winston = require('winston');
const fs = require('fs');
const path = require('path');

const { load, DataType, open, close, arrayConstructor, define } = require('ffi-rs');

const { execSync } = require('child_process');

class GameService {
    constructor() {
        this._gameId = "";
        this._column = 0;
        this._row = 0;
        this._players = {}

        // logging
        this._logRootDir = "";
        this._gameLogPath = "";
        this._gameLogger;
        this._playerLoggers = {}

        // 경로가 다르기 때문에 config.json에 직접 입력해줘야 한다.
        this._config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
    }

    setGame(gameId, column, row) {
        this._gameId = gameId;
        this._column = Number(column);
        this._row = Number(row);

        this._logRootDir = path.join(process.cwd(), 'logs');
        this._gameLogPath = path.join(this._logRootDir, gameId);

        console.log(this._gameLogPath);
        if (!fs.existsSync(this._gameLogPath)) {
            try {
                console.log(`${this._gameLogPath} is not exists. creating..`);
                fs.mkdirSync(this._gameLogPath, { recursive: true });
                console.log(`${this._gameLogPath} was created`);
            } catch (error) {
                console.log(error)
            }
        }

        this._gameLogger = winston.createLogger({
            format: winston.format.combine(
                winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                winston.format.printf(info => `[${gameId}:${info.timestamp}] ${info.message}`)
            ),
            transports: [
                new winston.transports.Console(),
                new winston.transports.File({ filename: `${this._gameLogPath}/game.log` })
            ]
        });
        this._gameLogger.info(`Game initiailized. GameId:${gameId}, column:${column}, row:${row}`);
    }

    getGame() {
        return {
            column: this._column,
            row: this._row
        }
    }

    async loadPlayer(position, filePath) {
        try {
            const builderPath = path.resolve(this._config.builder_path);
            const batchPath = path.resolve('./build.bat');

            const data = fs.readFileSync(filePath, 'utf8');
            fs.writeFileSync(builderPath + '/src/CppPlayer.cpp', data);

            let baseName = path.basename(filePath, path.extname(filePath));
            let baseTargetPath = builderPath + '/result/Release/' + baseName;
            let newTargetPath = baseTargetPath + '.dll';
            let counter = 1;
            while (fs.existsSync(newTargetPath)) {
                newTargetPath = `${baseTargetPath}_${counter}.dll`;
                counter += 1;
            }

            baseName = path.basename(newTargetPath, '.dll');
            const output = execSync(`${batchPath} ${filePath} ${builderPath} ${baseName}`, { encoding: 'utf-8' });

            var dllPath = builderPath + '/result/Release/' + baseName + '.dll';
            console.log(dllPath);

            const libName = baseName;
            open({
                library: libName, // key
                path: dllPath // path
            });

            const cppPlayer = define({
                initialize: {
                    library: libName,
                    retType: DataType.void,
                    paramsType: [DataType.I32, DataType.I32, DataType.I32]
                },
                getName: {
                    library: libName,
                    retType: DataType.String,
                    paramsType: []
                },
                moveNext: {
                    library: libName,
                    retType: DataType.I32,
                    paramsType: [DataType.I32, DataType.I32Array, DataType.I32]
                }
            });

            console.log(cppPlayer.getName());

            this._players[Number(position)] = {
                filePath,
                player: cppPlayer
            };
            return 200;
        }
        catch (error) {
            console.log("loadPlayer cpp error", error);
            return 400;
        }
    }

    getPlayerName(position) {
        try {
            position = Number(position);
            const { filePath, player } = this._players[position];
            return player.getName();
        }
        catch (error) {
            console.log("getPlayerName error", error);
            this._gameLogger.error(error);
            return error;
        }
    }

    initPlayer(position, column, row) {
        try {
            position = Number(position);
            const { filePath, player } = this._players[position];
            player.initialize(position, column, row);
            return 200;
        } catch (error) {
            // log	
            console.log("initPlayer error", error);
            this._gameLogger.error(error);
            return 400;
        }
    }

    moveNext(gameContext) {
        const { turn, current, map, position } = gameContext;
        const logger = this.getOrCreatePlayerLogger(position);
        try {
            const playerPosition = Number(position);
            const { filePath, player } = this._players[playerPosition];
            if (player === undefined) {
                return -1;
            }

            const direction = player.moveNext(map.length, new Array(map), current);
            const result = { turn, position, map, current, direction };
            logger.info(JSON.stringify(result, this.replacer, 2));
            return direction;
        }
        catch (error) {
            console.log("moveNext", error);
            const errorResult = { turn, position, map, current, direction: -1 };
            logger.info(JSON.stringify(errorResult, this.replacer, 2));
            this._gameLogger.error(error);
            return -1;
        }
    }

    getOrCreatePlayerLogger(position) {
        console.log(`get player logger:${position}`);

        try {
            const playerPosition = Number(position);
            let logger = this._playerLoggers[playerPosition]

            if (logger === undefined) {
                logger = winston.createLogger({
                    format: winston.format.combine(
                        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                        winston.format.printf(info => `[${this._gameId}:${info.timestamp}]\n${info.message}`)
                    ),
                    transports: [
                        new winston.transports.Console(),
                        new winston.transports.File({ filename: `${this._gameLogPath}/${playerPosition}.log` })
                    ]
                });

                this._playerLoggers[playerPosition] = logger;
            }

            return logger;
        } catch (error) {
            console.log("~~~~~~~~~~~~~~~~~", error)
            throw error;
        }
    }

    cleanup() {
        try {
            this._gameId = "";
            this._column = 0;
            this._row = 0;

            console.log("start cleanup!");
            // delete require() cache 
            for (const index in this._players) {
                const { filePath, player } = this._players[index];
                player = null;
                delete require.cache[require.resolve(filePath)];
                console.log("delete cache", filePath);
            }

            this._players = {}

            // dispose logger
            this._logRootDir = "";
            this._gameLogPath = "";
            this._gameLogger = null;
            this._playerLoggers = {}
            console.log("cleanup complated!");
        } catch (error) {
            console.log("cleanup error", error);
            return -1;
        }
    }

    replacer(key, value) {
        // int 배열을 한 줄로 표현 (여기서는 배열 길이 및 값 타입을 기준으로 처리)
        if (Array.isArray(value) && value.every(Number.isInteger)) {
            return JSON.stringify(value);
        }
        return value;
    };
}

module.exports = new GameService();