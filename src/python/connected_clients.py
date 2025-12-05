from typing import Set

from websockets.asyncio.server import ServerConnection

connected_clients: Set[ServerConnection] = set()

