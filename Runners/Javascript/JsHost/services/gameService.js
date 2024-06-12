class GameService {
	constructor() {
		this._column = 0;
		this._row = 0;
		this._players = {}
	}

	setGame(column, row) {
		this._column = Number(column);
		this._row = Number(row);
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
			this._players[position] ={
				filePath,
				player : instance
			};
			return 200;
		}
		catch (error) {
			// log
			console.log("loadPlayer error", error);
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
			return 400;
		}
	}

	moveNext(gameContext) {
		try {
			const { current, map, position } = gameContext;
			const playerPosition = Number(position);
			const { filePath, player } = this._players[playerPosition];			
			if (player === undefined) {
				return -1;
			}
			return player.moveNext(map, current);
		} catch (error) {
			console.log("moveNext", error);
			return -1;
		}
	}

	cleanup(){
		try {
			this._column = 0;
			this._row = 0;

			console.log("start cleanup!");
			// delete require() cache 
			for(const index in this._players)	{
				const { filePath, player } = this._players[index];				
				delete require.cache[require.resolve(filePath)];
				console.log("delete cache", filePath);
			}

			this._players = {}
			console.log("cleanup complated!");
		} catch (error) {
			console.log("cleanup error", error);
			return -1;
		}
	}
}

module.exports = new GameService();