from fastapi import FastAPI
from typing import Optional
from PyHost.routes import game, player
from PyHost.services.game_service import GameService
from PyHost.services.player_service import PlayerService
from PyHost.services.player_loader import PlayerLoader
import uvicorn

app = FastAPI()

@app.on_event("startup")
async def startup_event():
    player_loader = PlayerLoader()
    player_service = PlayerService(player_loader)
    app.state.game_service_instance = GameService(player_service)

app.include_router(game.router, prefix="/coinchallenger/py/game", tags=["game"])
app.include_router(player.router, prefix="/coinchallenger/py/player", tags=["player"])

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)