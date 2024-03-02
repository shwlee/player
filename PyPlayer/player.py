import random

my_number = None
column = None
row = None

# Player 를 초기화 합니다. 게임 환경을 인자로 전달받습니다. 전달받은 인자는 게임 동안 유지해야합니다.
# int: myNumber = 할당받은 플레이어 번호. (플레이 순서)
# int: column = 현재 생성된 보드의 열.
# int: row = 현재 생성된 보드의 행.
def Initialize(my_number_input, column_input, row_input):
    global my_number, column, row
    my_number = my_number_input
    column = column_input
    row = row_input

# Player 의 이름을 반환합니다. 현재 플레이어의 이름을 하드코딩하여 반환합니다.
def GetName():
    return 'Python Player'

# 현재 턴에서 진행할 방향을 결정합니다. map 정보와 현재 플레이어의 위치를 전달받은 후 다음 이동 방향을 반환해야 합니다.
# 결정 방향은 left, up, right, down 순서로 0, 1, 2, 3 정수로 표현해야합니다.// 
# map: int[]  1차원 배열로 표현된 현재 map 정보.
# myPosition:int 현재 플레이어의 위치. map 배열의 인덱스로 표시됨
# returns:이번 프레임에 진행할 방향. left, up, right, down 순서오 0, 1, 2, 3 으로 표현.
def MoveNext(map, my_position):
    return random.randint(0, 3)
