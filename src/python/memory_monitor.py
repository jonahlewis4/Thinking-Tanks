import asyncio
from dataclasses import dataclass


@dataclass
class GameState:
    lives: int = 0


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
                print("Hook failed, retrying in 100ms...")
                await asyncio.sleep(0.1)

    def cleanup(self):
        if self._api.is_hooked():
            self._api.un_hook()
