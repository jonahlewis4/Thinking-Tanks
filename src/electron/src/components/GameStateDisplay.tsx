import { useEffect, useState } from "react";

interface GameState {
    lives: number;
    error: string | null;
}

const GameStateDisplay = () => {
    const [gameState, setGameState] = useState<GameState | null>(null);

    useEffect(() => {
        const ws = new WebSocket("ws://localhost:8765");

        ws.onopen = () => console.log("Connected to game state server");

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                setGameState({
                    lives: data.lives ?? 0,
                    error: data.error ?? null,
                });
            } catch (e) {
                setGameState({ lives: 0, error: "Invalid data from server" });
            }
        };

        ws.onclose = () => console.log("Disconnected from server");

        return () => ws.close();
    }, []);

    return (
        <div className="max-w-sm mx-auto mt-10 p-6 rounded-xl shadow-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-white font-mono text-center">
            <h1 className="text-2xl mb-4 font-bold drop-shadow-lg">Wii Play Tanks</h1>

            {gameState === null ? (
                <div className="text-yellow-300 font-bold mb-4">Waiting for game state...</div>
            ) : gameState.error ? (
                <div className="text-red-400 font-bold mb-4">
                    Error: {gameState.error}
                </div>
            ) : (
                <>
                    <div className="text-lg mb-4">
                        <span className="font-bold mr-2">Lives:</span>
                        <span className="text-yellow-300 text-xl drop-shadow-sm">
                            {gameState.lives}
                        </span>
                    </div>

                    <div className="flex justify-center gap-2">
                        {Array.from({ length: gameState.lives }).map((_, i) => (
                            <span
                                key={i}
                                className="text-xl animate-bounce"
                                role="img"
                                aria-label="tank"
                            >
                                🛡️
                            </span>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default GameStateDisplay;
