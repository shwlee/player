const express = require("express");
const gameService = require("../services/gameService");
const router = express.Router();

// content-type : x-www-form-urlencoded
router.post("/load", (req, res, next) => {
  const { position, filePath } = req.body;
  gameService.loadPlayer(position, filePath);
  res.status(200).end();
});

// content-type : x-www-form-urlencoded
router.post("/init", (req, res, next) => {
  const { position, column, row } = req.body;
  gameService.initPlayer(position, column, row);
  res.status(200).end();
});

router.post("/movenext", (req, res, next) => {
  const map = req.body;
  const direction = gameService.moveNext(map);
  res.send({ direction });
});

router.get("/name/:position", (req, res, next) => {
  const { position } = req.params;
  const playerName = gameService.getPlayerName(position);
  res.send(playerName);
});

module.exports = router