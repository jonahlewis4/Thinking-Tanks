from dataclasses import dataclass


@dataclass
class GameState:
    lives: int

class DolphinMemoryMonitor:
    def __init__(self):
        pass

    _lives_address = 0x91D281FF


    def refresh(self) -> GameState:
        result : GameState = GameState()
        result.lives = readByte(_lives_address)

        return result



