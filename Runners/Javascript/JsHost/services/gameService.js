const gameService = {
	_column: 0,
	_row: 0,
	setGame: function (column, row) {
		this._column = column;
		this._row = row;
	},

	getGame: function () {
		return {
			column: this._column,
			row: this._row
		}
	}
}

module.exports = gameService;