import asyncio
import websockets

from memory_handler import game_state_handler, broadcast_game_state, monitor



async def main():
    host = "localhost"
    port = 8765
    print(f"Starting WebSocket server on ws://{host}:{port}")

    async with websockets.serve(game_state_handler, host, port):
        await broadcast_game_state()


if __name__ == "__main__":
    try:
        asyncio.run(main())
    finally:
        monitor.cleanup()
