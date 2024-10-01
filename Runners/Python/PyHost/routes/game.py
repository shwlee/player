from fastapi import FastAPI, APIRouter, Depends, Query, HTTPException, BackgroundTasks
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from PyHost.services.game_service import GameService

router = APIRouter()

def get_game_service() -> GameService:
    return GameService()

@router.get("/")
async def get_current_game_set(game_service: GameService = Depends(get_game_service)):
    current_set = game_service.get_current_game_set()
    return JSONResponse(content=current_set, status_code=200)

@router.get("/healthy")
async def healthy():
    return JSONResponse(content="Healthy", status_code=200)

@router.post("/set")
async def set_game(column: int = Query(...), row: int = Query(...), game_service: GameService = Depends(get_game_service)):
    try:
        game_service.init_game(column, row)
        return JSONResponse(content="Game set successfully", status_code=200)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/shutdown")
async def shutdown(background_tasks: BackgroundTasks):
    def stop_app():
        import os
        os._exit(0)
    background_tasks.add_task(stop_app)
    return JSONResponse(content="Server is shutting down", status_code=200)

@router.post("/cleanup")
async def cleanup(game_service: GameService = Depends(get_game_service)):
    game_service.clean_up()
    return JSONResponse(content="Clean up successful", status_code=200)