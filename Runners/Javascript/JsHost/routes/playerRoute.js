const express = require("express");
const multer  = require('multer');
const upload = multer();
const gameService = require("../services/gameService");
const router = express.Router();

router.post("/load", upload.none(), async (req, res, next) => {  
  const { position, filePath } = req.body;  
  await gameService.loadPlayer(position, filePath);
  res.status(200).end();
});

router.post("/init", upload.none(), (req, res, next) => {
  const { position, column, row } = req.body;
  gameService.initPlayer(position, column, row);
  res.status(200).end();
});

router.post("/movenext", async (req, res, next) => {  
  const map = req.body;  
  const direction = await gameService.moveNext(map);
  res.send(direction.toString());  
});

router.get("/name/:position", (req, res, next) => {
  const { position } = req.params;
  const playerName = gameService.getPlayerName(position);
  res.send(playerName);
});

module.exports = router;