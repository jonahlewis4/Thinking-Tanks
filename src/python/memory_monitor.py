from dataclasses import dataclass


@dataclass
class GameState:
    lives: int


def _read_byte(address : int) -> int :
    return 0


class DolphinMemoryMonitor:
    def __init__(self):
        pass


    def refresh(self) -> GameState:
        result : GameState = GameState()
        result.lives = _read_byte(self._lives_address)

        return result


    #Private variables
    _lives_address = 0x91D281FF

