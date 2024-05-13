class GameService {
	constructor() {
		this._column = 0;
		this._row = 0;
		this._players = {}
	}

	setGame(column, row) {
		this._column = column;
		this._row = row;
	}

	getGame() {
		return {
			column: this._column,
			row: this._row
		}
	}

	loadPlayer(position, filePath) {
		try {
			const runner = require(filePath); // A.js 모듈 로드
			const instance = new runner(); // a1 클래스의 인스턴스 생성
			this._players[position] = instance;
			return 200;
		}
		catch (error) {
			// log
			console.log(error);
			return 400; // 실패 시 400 에러로 반환
		}
	}

	getPlayerName(position) {
		try {
			const player = this._players[position];
			return player.getName();
		}
		catch (error) {
			return error;
		}
	}

	initPlayer(position, column, row) {
		try {
			const player = this._players[position];
			player.initialize(position, column, row);
			return 200;
		} catch (error) {
			// log	
			console.log(error);
			return 400;
		}
	}

	moveNext(gameContext) {
		try {
			const { current, map, position } = gameContext;
			const player = this._players[position.toString()];
			if (player === undefined) {
				return -1;
			}
			return player.moveNext(map, current);
		} catch (error) {
			return -1;
		}
	}
}

module.exports = new GameService();