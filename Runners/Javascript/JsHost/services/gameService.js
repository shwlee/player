const winston = require('winston');
const fs = require('fs');
const path = require('path');

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
    }

    setGame(gameId, column, row) {
        this._gameId = gameId;
        this._column = Number(column);
        this._row = Number(row);

        this._logRootDir = path.join(path.dirname(process.execPath), 'logs');
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

    loadPlayer(position, filePath) {
        try {
            position = Number(position);
            const runner = require(filePath); // A.js 모듈 로드
            const instance = new runner(); // a1 클래스의 인스턴스 생성
            this._players[position] = {
                filePath,
                player: instance
            };
            return 200;
        }
        catch (error) {
            // log
            console.log("loadPlayer error", error);
            this._gameLogger.error(error);
            return 400; // 실패 시 400 에러로 반환
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

    async moveNext(gameContext) {
        const { turn, current, map, position } = gameContext;
        const logger = this.getOrCreatePlayerLogger(position);
        try {
            const playerPosition = Number(position);
            const { filePath, player } = this._players[playerPosition];
            if (player === undefined) {
                return -1;
            }
            const direction = await player.moveNext(map, current);
            const result = { turn, position, map, current, direction };
            logger.info(JSON.stringify(result, this.replacer, 2));
            return direction;
        } catch (error) {
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