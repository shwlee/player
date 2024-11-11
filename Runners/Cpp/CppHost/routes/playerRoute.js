const express = require("express");
const multer = require('multer');
const upload = multer();
const gameService = require("../services/gameService");
const router = express.Router();

router.post("/load", upload.none(), async (req, res, next) => {
  console.log(req.body);
  const { position, filePath } = req.body;
  const loaded = await gameService.loadPlayer(position, filePath);    
  res.status(loaded).end();
});

router.post("/init", upload.none(), (req, res, next) => {
  const { position, column, row } = req.body;
  const intialized = gameService.initPlayer(position, column, row);
  res.status(intialized).end();
});

router.post("/movenext", async (req, res, next) => {
  const thisTurn = req.body;
  const direction = await gameService.moveNext(thisTurn);
  res.send(direction.toString());
});

router.get("/name/:position", (req, res, next) => {
  const { position } = req.params;
  const playerName = gameService.getPlayerName(position);
  res.send(playerName);
});

module.exports = router;