import json

class GameState:
    lives: int
    error: str = None

    def __init__(self, lives: int = 0, error: str = None):
        self.lives = lives
        self.error = error

    def jsonify(self) -> str:
        return json.dumps({
            "lives": self.lives,
            "error": self.error
        })


class MemoryHookError(Exception):
    """Raised when Dolphin memory hook fails."""
    pass


class DolphinMemoryMonitor:
    def __init__(self):
        import dolphin_memory_engine as dme  # imported here intentionally
        self._api = dme
        self._lives_address = 0x91D281FF

    def refresh(self) -> GameState:
        """Return current game state or error if reading fails."""
        try:
            self._ensure_hook()
            lives = self._api.read_byte(self._lives_address)
            return GameState(lives=lives)
        except Exception as e:
            return GameState(error=str(e))

    def _ensure_hook(self):
        """Fail immediately if we can't hook Dolphin."""
        if not self._api.hook():
            raise MemoryHookError("Failed to hook Dolphin memory engine")

    def cleanup(self):
        """Unhook memory engine if hooked."""
        if self._api.is_hooked():
            self._api.un_hook()
