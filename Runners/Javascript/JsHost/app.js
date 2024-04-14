const express = require("express");
const gameRouter = require("./routes/gameRoute");
const playerRouter = require("./routes/playerRoute");
const port = process.argv[2] ?? 50923;
const app = express()

app.use("/coinchallenger/js/game", gameRouter);
app.use("/coinchallenger/js/player", playerRouter);

app.listen(port);