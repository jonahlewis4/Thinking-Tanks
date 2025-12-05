import asyncio
import json


class GameState:
    lives: int
    def __init__(self, lives: int):
        self.lives = lives

    def jsonify (self) -> str:
        return json.dumps({
            "lives": self.lives,
            # add more fields here later
        })


class DolphinMemoryMonitor:
    def __init__(self):
        import dolphin_memory_engine as dme   # imported here intentionally
        self._api = dme
        self._lives_address = 0x91D281FF

    # expose only what you want:
    async def refresh(self):
        await self._ensure_hook()
        return GameState(
            lives=self._api.read_byte(self._lives_address)
        )

    async def _ensure_hook(self):
        while not self._api.is_hooked():
            if not self._api.hook():
                print("Hook failed, retrying in 2s...")
                await asyncio.sleep(2)

    def cleanup(self):
        if self._api.is_hooked():
            self._api.un_hook()
