import asyncio
import json
from typing import TypedDict, Set
import websockets
from websockets.asyncio.server import ServerConnection


class CounterMessage(TypedDict):
    """Structure for the counter message object"""
    counter: int
    timestamp: float

# Global counter and set of connected clients
global_counter: int = 0
connected_clients: Set[ServerConnection] = set()

async def counter_handler(websocket: ServerConnection) -> None:
    """Handle WebSocket connection"""
    print(f"Client connected: {websocket.remote_address}")

    # Register client
    connected_clients.add(websocket)

    try:
        # Keep connection alive
        await websocket.wait_closed()
    except websockets.exceptions.ConnectionClosed:
        pass
    finally:
        # Unregister client
        connected_clients.remove(websocket)
        print(f"Client disconnected: {websocket.remote_address}")

async def broadcast_counter() -> None:
    """Broadcast counter to all connected clients"""
    global global_counter

    while True:
        if connected_clients:
            # Create counter message
            data: CounterMessage = {
                "counter": global_counter,
                "timestamp": asyncio.get_event_loop().time()
            }

            message = json.dumps(data)
            print(f"Broadcasting: {data}")

            # Send to all connected clients
            websockets.broadcast(connected_clients, message)

            global_counter += 1

        # Wait 1 second before next update
        await asyncio.sleep(1)

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