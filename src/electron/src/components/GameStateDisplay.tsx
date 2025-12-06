import { useEffect, useState } from "react";

interface Tank {
    x: number;
    y: number;
}

interface Player extends Tank {}

interface Enemy extends Tank {}

interface GameState {
    lives: number;
    level_number: number;
    player: Player;
    num_starting_enemies: number;
    num_remaining_enemies: number;
    enemies: Enemy[];
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

                // Map incoming data to the full GameState shape
                const mappedState: GameState = {
                    lives: data.lives ?? 0,
                    level_number: data.level_number ?? 0,
                    player: data.player ?? { x: 0, y: 0 },
                    num_starting_enemies: data.num_starting_enemies ?? 0,
                    num_remaining_enemies: data.num_remaining_enemies ?? 0,
                    enemies: data.enemies ?? [],
                    error: data.error ?? null,
                };

                setGameState(mappedState);
            } catch (e) {
                setGameState({
                    lives: 0,
                    level_number: 0,
                    player: { x: 0, y: 0 },
                    num_starting_enemies: 0,
                    num_remaining_enemies: 0,
                    enemies: [],
                    error: "Invalid data from server",
                });
            }
        };

        ws.onclose = () => console.log("Disconnected from server");

        return () => ws.close();
    }, []);

    return (
        <div className="max-w-md mx-auto mt-10 p-6 rounded-xl shadow-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-white font-mono text-center">
            <h1 className="text-2xl mb-6 font-bold drop-shadow-lg">Wii Play Tanks</h1>

            {gameState === null ? (
                <div className="text-yellow-300 font-bold mb-4">Waiting for game state...</div>
            ) : gameState.error ? (
                <div className="text-red-400 font-bold mb-4">
                    Error: {gameState.error}
                </div>
            ) : (
                <>
                    {/* Lives */}
                    <div className="text-lg mb-4">
                        <span className="font-bold mr-2">Lives:</span>
                        <span className="text-yellow-300 text-xl drop-shadow-sm">
                            {gameState.lives}
                        </span>
                    </div>

                    {/* Tank icons for lives */}
                    <div className="flex justify-center gap-2 mb-6">
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

                    {/* Level */}
                    <div className="text-lg mb-4">
                        <span className="font-bold">Level:</span>{" "}
                        <span className="text-green-300">{gameState.level_number}</span>
                    </div>

                    {/* Player position */}
                    <div className="text-lg mb-4">
                        <span className="font-bold">Player Position:</span>{" "}
                        ({gameState.player.x.toFixed(1)}, {gameState.player.y.toFixed(1)})
                    </div>

                    {/* Enemies */}
                    <div className="text-lg mb-4">
                        <span className="font-bold">Enemies Remaining:</span>{" "}
                        {gameState.num_remaining_enemies}/{gameState.num_starting_enemies}
                    </div>

                    {/* Enemy coordinates list */}
                    <div className="text-left mx-auto bg-black/30 p-3 rounded-lg shadow-inner max-h-40 overflow-y-auto">
                        <h2 className="font-bold mb-2 text-center">Enemies</h2>

                        {gameState.enemies.length === 0 ? (
                            <div className="text-gray-300 text-sm text-center">No enemies</div>
                        ) : (
                            <ul className="text-sm space-y-1">
                                {gameState.enemies.map((enemy, i) => (
                                    <li key={i}>
                                        Enemy {i + 1}: ({enemy.x.toFixed(1)}, {enemy.y.toFixed(1)})
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default GameStateDisplay;
