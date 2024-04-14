const express = require("express");
const bodyParser = require('body-parser');
const gameRouter = require("./routes/gameRoute");
const playerRouter = require("./routes/playerRoute");
const port = process.argv[2] ?? 50923;
const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use("/coinchallenger/js/game", gameRouter);
app.use("/coinchallenger/js/player", playerRouter);

app.listen(port);