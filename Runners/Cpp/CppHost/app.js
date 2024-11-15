const express = require("express");
const bodyParser = require('body-parser');
const gameRouter = require("./routes/gameRoute");
const playerRouter = require("./routes/playerRoute");
const port = process.argv[2] ?? 50309;
const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use("/coinchallenger/cpp/game", gameRouter);
app.use("/coinchallenger/cpp/player", playerRouter);

app.shutdown = function() {
    server.close(() => {
      console.log('Closed remaining connections.');
      process.exit(0);
    });
  
    // Force shutdown if connections do not close within 5 seconds
    setTimeout(() => {
      console.error('Could not close connections in time, forcefully shutting down.');
      process.exit(1);
    }, 5000);
  };

  // Handle termination signals
const shutdown = () => {
    console.log('Shutdown signal received.');
    app.shutdown();
  };
  
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);

const server = app.listen(port);