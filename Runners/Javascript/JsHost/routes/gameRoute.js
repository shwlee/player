const gameService = require("../services/gameService");
const express = require("express");
const router = express.Router();

router.get("/healthy", (req, res, next) => {
  res.status(200).end();
});

router.get("/", (req, res, next) => {
  res.send(gameService.getGame());
});

router.post("/set", (req, res, next) => {  
  let { column, row } = req.query;
  console.log(column, row);
  gameService.setGame(column, row);
  res.status(200).end();
});

router.post("/cleanup", (req, res, next) => {
  gameService.cleanup();
  res.status(200).end();
});

router.post("/shutdown", (req, res, next) => {
  res.status(200).end();
  req.app.shutdown();
});

module.exports = router