from dataclasses import dataclass, asdict, field
import json

@dataclass
class Tank:
    x: float = 0.0
    y: float = 0.0

@dataclass
class Player(Tank):
    pass

@dataclass
class Enemy(Tank):
    color: int = 2
    alive : bool = False
    pass

@dataclass
class GameState:

    lives: int = 0
    level_number: int = 0
    player: Player = field(default_factory=Player)
    num_starting_enemies: int = 0
    num_remaining_enemies: int = 0
    enemies: list[Enemy] = field(default_factory=list)
    error: str | None = None

    def jsonify(self) -> str:
        return json.dumps(asdict(self))



class MemoryHookError(Exception):
    """Raised when Dolphin memory hook fails."""
    pass


class DolphinMemoryMonitor:
    def __init__(self):
        import dolphin_memory_engine as dme  # imported here intentionally
        self._api = dme
        self._lives_address = 0x91D281FF
        self._level_number_address = 0x91D27FFF

        self._player_x_address = 0x91CFABC4
        self._player_y_address = 0x91CFABCC

        self.num_starting_enemies_address = 0x91D27EFF
        self.num_remaining_enemies_address = 0x91CFAB8B
        self._enemy_x_address_0 = 0x91CFDD84
        self._enemy_y_address_0 = 0x91CFDD8C
        self._enemy_color_address_0 = 0x91CFDE6B
        self._enemy_alive_address_0 = 0x91CFDE67
        self._dist_between_enemies = 6344

    def refresh(self) -> GameState:
        """Return current game state or error if reading fails."""
        try:
            self._ensure_hook()
            g: GameState = GameState()

            lives : int = self._api.read_byte(self._lives_address)
            g.lives = lives

            level_number : int = self._api.read_byte(self._level_number_address)
            g.level_number = level_number

            player_x: float = self._api.read_float(self._player_x_address)
            player_y: float = self._api.read_float(self._player_y_address)
            g.player.x = player_x
            g.player.y = player_y

            num_starting_enemies: int = self._api.read_byte(self.num_starting_enemies_address)
            g.num_starting_enemies = num_starting_enemies

            num_remaining_enemies: int = self._api.read_byte(self.num_remaining_enemies_address)
            g.num_remaining_enemies = num_remaining_enemies

            for i in range(num_starting_enemies):
                e: Enemy = Enemy()
                offset = i * self._dist_between_enemies

                x_pos_address = self._enemy_x_address_0 + offset
                y_pos_address = self._enemy_y_address_0 + offset
                x_pos: float = self._api.read_float(x_pos_address)
                y_pos: float = self._api.read_float(y_pos_address)
                e.x = x_pos
                e.y = y_pos

                color_address = self._enemy_color_address_0 + offset
                color: int = self._api.read_byte(color_address)
                e.color = color

                alive_address =  self._enemy_alive_address_0 + offset
                alive: bool = (self._api.read_byte(alive_address) > 0)
                e.alive = alive

                g.enemies.append(e)

            return g
        except Exception as e:
            g: GameState = GameState()
            g.error = str(e)
            return g

    def _ensure_hook(self):
        """Fail immediately if we can't hook Dolphin."""
        if(self._api.is_hooked()):
            return
        if not self._api.hook():
            raise MemoryHookError("Failed to hook Dolphin memory engine")

    def cleanup(self):
        """Unhook memory engine if hooked."""
        if self._api.is_hooked():
            self._api.un_hook()
