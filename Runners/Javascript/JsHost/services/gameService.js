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
		const runner = require(filePath); // A.js 모듈 로드
		const instance = new runner(); // a1 클래스의 인스턴스 생성
		this._players[position] = instance;
	}

	getPlayerName(position) {		
		const player = this._players[position];
		return player.getName();
	}

	initPlayer(position, column, row) {
		const player = this._players[position];
		player.initialize(position, column, row);
	}

	moveNext(gameContext) {
		const { current, map, position } = gameContext;
		const player = this._players[position.toString()];		
		if (player === undefined)
		{
			return -1;
		}
		return player.moveNext(map, current);
	}
}

module.exports = new GameService();