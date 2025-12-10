import { useEffect, useState } from "react";

// ------------------
// Types
// ------------------

export interface Tank {
    x: number;
    y: number;
}

export interface Player extends Tank {}

export enum TankColor {
    Player1 = 0,
    Player2 = 1,
    Brown = 2,
    Grey = 3,
    Turquoise = 4,
    Pink = 5,
    Yellow = 6,
    Purple = 7,
    Green = 8,
    White = 9,
    Black = 10,
}

export interface Enemy extends Tank {
    color: TankColor;
    alive?: boolean;
}

export interface GameState {
    lives: number;
    level_number: number;
    player: Player;
    num_starting_enemies: number;
    num_remaining_enemies: number;
    enemies: Enemy[];
    error: string | null;
}


// ------------------
// UI
// ------------------

const GameStateDisplay = () => {
    const [gameState, setGameState] = useState<GameState | null>(null);

    useEffect(() => {
        const ws = new WebSocket("ws://localhost:8765");

        ws.onopen = () => console.log("Connected to game state server");

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data) as GameState;
                setGameState(data);
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

    if (gameState === null)
        return <div className="text-white">Waiting on server...</div>;

    if (gameState.error)
        return <div className="text-red-400 font-bold">Error: {gameState.error}</div>;


    return (
        <div className="max-w-sm mx-auto mt-10 p-6 rounded-xl shadow-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-white font-mono text-center">
            <h1 className="text-2xl mb-4 font-bold drop-shadow-lg">Wii Play Tanks</h1>

            {/* Lives count */}
            <div className="text-lg mb-4">
                <span className="font-bold mr-2">Lives:</span>
                <span className="text-yellow-300 text-xl drop-shadow-sm">
                    {gameState.lives}
                </span>
            </div>

            {/* Animated lives icons */}
            <div className="flex justify-center gap-2 mb-6">
                {Array.from({ length: gameState.lives }).map((_, i) => (
                    <span key={i} className="text-xl animate-bounce">🛡️</span>
                ))}
            </div>

            {/* Enemy tanks */}
            <h2 className="text-lg font-bold mb-2">Enemies</h2>

            <div className="flex flex-col items-center gap-3">
                {gameState.enemies.map((enemy, i) => (
                    <div
                        key={i}
                        className={`flex items-center gap-2 bg-white/10 px-3 py-1 rounded-lg ${
                            enemy.alive === false ? "opacity-50" : ""
                        }`}
                    >
                        <div className="relative">
                            <TankIcon color={enemy.color} />
                            {enemy.alive === false && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-full h-0.5 bg-red-500 rotate-45" style={{ width: "28px" }}></div>
                                </div>
                            )}
                        </div>
                        <span className={`text-sm text-yellow-200 ${
                            enemy.alive === false ? "line-through" : ""
                        }`}>
                            (x: {enemy.x.toFixed(1)}, y: {enemy.y.toFixed(1)})
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GameStateDisplay;


// ------------------
// Tank Icon Renderer
// ------------------

const tankColorToHex: Record<TankColor, string> = {
    [TankColor.Player1]: "#007bff",
    [TankColor.Player2]: "#ff0000",
    [TankColor.Brown]: "#8b4513",
    [TankColor.Grey]: "#808080",
    [TankColor.Turquoise]: "#40e0d0",
    [TankColor.Pink]: "#ff69b4",
    [TankColor.Yellow]: "#ffd700",
    [TankColor.Purple]: "#800080",
    [TankColor.Green]: "#00ff00",
    [TankColor.White]: "#ffffff",
    [TankColor.Black]: "#000000",
};

const TankIcon = ({ color }: { color: TankColor }) => {
    return (
        <span
            style={{
                width: "22px",
                height: "22px",
                backgroundColor: tankColorToHex[color],
                borderRadius: "4px",
                border: "2px solid #c8a370",
                display: "inline-block",
            }}
        />
    );
};