import random

class Player:
    def __init__(self):
        self._my_number = None
        self._column = None
        self._row = None

    def get_name(self) -> str:
        """
        플레이어의 이름을 반환합니다.
        """
        return "python player"

    def initialize(self, my_number: int, column: int, row: int):
        """
        플레이어의 초기화 메서드.
        :param my_number: 플레이어 번호
        :param column: 열 크기
        :param row: 행 크기
        """
        self._my_number = my_number
        self._column = column
        self._row = row

    def move_next(self, map: list[int], my_position: int) -> int:
        """
        플레이어의 다음 이동을 결정하는 메서드.
        :param map: 게임 맵 정보
        :param my_position: 플레이어의 현재 위치
        :return: 0(상), 1(우), 2(하), 3(좌) 중 랜덤 방향
        """
        direction = random.randint(0, 3)
        return direction
