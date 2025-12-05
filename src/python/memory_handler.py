import asyncio

import websockets
from websockets.asyncio.server import ServerConnection
from memory_monitor import GameState, DolphinMemoryMonitor
from connected_clients import connected_clients

monitor : DolphinMemoryMonitor = DolphinMemoryMonitor()
async def game_state_handler(ws: ServerConnection):
    """Register client and keep connection open."""
    connected_clients.add(ws)
    print(f"Client connected: {ws.remote_address}")

    try:
        # Keep the connection open
        async for _ in ws:
            pass
    except websockets.ConnectionClosed:
        pass
    finally:
        connected_clients.remove(ws)
        print(f"Client disconnected: {ws.remote_address}")


async def broadcast_game_state():
    """Periodically send game state to all clients."""
    while True:
        # Refresh game state from Dolphin
        state : GameState = monitor.refresh()

        # Convert to JSON
        data = state.jsonify()
        print(f"Read game state: {data}")

        # Broadcast to all connected clients
        disconnected = set()
        if connected_clients:
            for ws in list(connected_clients):
                try:
                    await ws.send(data)
                    print(f"Sent game state to {ws.remote_address}")
                except websockets.ConnectionClosed:
                    connected_clients.remove(ws)
                    disconnected.add(ws)

        for ws in disconnected:
            print(f"Client disconnected unexpectedly: {ws.remote_address}")
            connected_clients.remove(ws)

        await asyncio.sleep(1)  # send every 1 second

