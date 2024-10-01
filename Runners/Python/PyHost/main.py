from fastapi import FastAPI
from PyHost.routes import game, player

app = FastAPI()

app.include_router(game.router, prefix="/coinchallenger/py/game", tags=["game"])
app.include_router(game.router, prefix="/coinchallenger/py/player", tags=["player"])