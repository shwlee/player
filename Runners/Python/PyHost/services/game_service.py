import asyncio
import time

class GameService:
    def __init__(self, player_service):
        self._player_service = player_service
        self._column = 0
        self._row = 0
        self._total_packet_size = 0

    def init_game(self, column, row):
        self._column = column
        self._row = row
        map_packet_size = (column * row) * 4
        self._total_packet_size = map_packet_size + 4

    async def load_player(self, position, file_path, cancellation_token=None):
        await self._player_service.load_player(position, file_path, cancellation_token)

    def get_player_name(self, position):
        player = self._player_service.get_player(position)
        if player:
            return player.get_name()
        raise Exception(f"{position} Player name is null")

    def initialize_player(self, position, column, row):
        player = self._player_service.get_player(position)
        if player:
            player.initialize(position, column, row)
        else:
            raise Exception(f"Player at position {position} not found")

    async def move_next(self, message, cancellation_token=None):
        try:
            position, map_data, current = message

            return await asyncio.to_thread(self._move_next_sync, position, map_data, current)
        except Exception as ex:
            raise  Exception(f"Error during move_next: {ex}")

    def _move_next_sync(self, position, map_data, current):
        player = self._player_service.get_player(position)
        if player is None:
            raise Exception(f"Player at position {position} not found")

        start_time = time.time()
        direction = player.move_next(map_data, current)
        elapsed_time = (time.time() - start_time) * 1000
        print(f"position: {position}, direction: {direction}, elapsed: {elapsed_time} ms")

        if direction < 0 or direction > 3:
            raise Exception(f"The result is out of range. result: {direction}")

        return direction

    def get_current_game_set(self):
        return GameSet(self._column, self._row)

    def clean_up(self):
        self._column = 0
        self._row = 0
        self._player_service.clean_up()