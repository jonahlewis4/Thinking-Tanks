import asyncio
import json
from typing import TypedDict, Set
import websockets
from websockets.asyncio.server import ServerConnection

from src.python.counter import broadcast_counter, counter_handler

connected_clients: Set[ServerConnection] = set()
async def main() -> None:
    """Start WebSocket server"""
    host: str = "localhost"
    port: int = 8765

    print(f"Starting WebSocket server on ws://{host}:{port}")

    async with websockets.serve(counter_handler, host, port):
        # Run the broadcast loop
        await broadcast_counter()

if __name__ == "__main__":
    asyncio.run(main())