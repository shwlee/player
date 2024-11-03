from pydantic import BaseModel
from typing import List

class GameMessage(BaseModel):
    position: int
    map: List[int]
    current: int