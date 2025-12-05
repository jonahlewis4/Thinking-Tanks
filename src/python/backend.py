import asyncio
import json
from typing import TypedDict
import websockets


class CounterMessage(TypedDict):
    """Structure for the counter message object"""
    counter: int
    timestamp: float

async def counter_handler(websocket) -> None:
    """Handle WebSocket connection and send incrementing counter"""
    print(f"Client connected: {websocket.remote_address}")

    counter: int = 0
    try:
        while True:
            # Create object with incrementing number
            data: CounterMessage = {
                "counter": counter,
                "timestamp": asyncio.get_event_loop().time()
            }

            # Send JSON object to client
            await websocket.send(json.dumps(data))
            print(f"Sent: {data}")

            counter += 1

            # Wait 1 second before sending next update
            await asyncio.sleep(1)

    except websockets.exceptions.ConnectionClosed:
        print(f"Client disconnected: {websocket.remote_address}")

async def main() -> None:
    """Start WebSocket server"""
    host: str = "localhost"
    port: int = 8765

    print(f"Starting WebSocket server on ws://{host}:{port}")

    async with websockets.serve(counter_handler, host, port):
        await asyncio.Future()  # Run forever

if __name__ == "__main__":
    asyncio.run(main())