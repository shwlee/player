const os = require('os');
const platform = os.platform();
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

        if (process.pkg)
        {
            this._startupPath = path.resolve(process.execPath + '/..');
            this._builderPath = path.join(this._startupPath, '../../../../../playerHost/Runners/Cpp/CppPlayer');
            if (!fs.existsSync(this._builderPath)) {
                this._builderPath = path.join(this._startupPath, '../../CppPlayer');
            }
            if (!fs.existsSync(this._builderPath)) {
                this._builderPath = path.join(this._startupPath, 'CppPlayer');
            }
        }
        else 
        {
            this._startupPath = process.cwd();
            this._builderPath = path.join(this._startupPath, '../../../../playerHost/Runners/Cpp/CppPlayer');
        }
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
            // set ext by platform
            var libExt = '';
            var scriptExt = '';
            if (platform === 'darwin') {
                libExt = '.dylib';
                scriptExt = '.sh';
            } else if (platform === 'win32') {
                libExt = '.dll'
                scriptExt = '.bat';
            }

            const builderPath = this._builderPath;

            // make unique name
            let baseName = path.basename(filePath, path.extname(filePath));
            let baseTargetPath = builderPath + '/../build/' + baseName;
            let newTargetPath = baseTargetPath + libExt;
            let counter = 1;
            while (fs.existsSync(newTargetPath)) {
                newTargetPath = `${baseTargetPath}_${counter}${libExt}`;
                counter += 1;
            }
            baseName = path.basename(newTargetPath, libExt);

            // find cpp builder and execute.
            var scriptPath = path.join(builderPath, 'build' + scriptExt); 
            if (platform === 'darwin')
            {
                fs.chmodSync(scriptPath, 0o755);
                execSync(`sh ${scriptPath} ${baseName}`, { encoding: 'utf-8' });
            }
            else
            {
                execSync(`${scriptPath} ${baseName} ${filePath}`, { encoding: 'utf-8' });
            }

            // load and cache dll as player
            var libName = baseName;
            var dllPath = builderPath + '/../build/' + baseName + libExt;
            open({
                library: libName, // key
                path: dllPath // path
            });

            const cppPlayer = define({
                initialize: {
                    library: libName,
                    retType: DataType.Void,
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

            this._players[Number(position)] = {
                filePath,
                libName: libName,
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
            const { filePath, libName, player } = this._players[position];
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
            const { filePath, libName, player } = this._players[position];
            player.initialize([parseInt(position), parseInt(column), parseInt(row)]);
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
            const { filePath, libName, player } = this._players[playerPosition];
            if (player === undefined) {
                return -1;
            }

            const intArray = map.map(numStr => parseInt(numStr));
            const direction = player.moveNext([intArray.length, intArray, parseInt(position)]);
            
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
                const { filePath, libName, player } = this._players[index];
                close(libName);
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