import {useEffect, useRef, useState} from "react";

interface CounterMessage {
    counter: number;
    timestamp: number;
}

type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

const Counter = () => {
    const [counter, setCounter] = useState<number | null>(null);
    const [timestamp, setTimestamp] = useState<string>('Waiting for data...');
    const [status, setStatus] = useState<ConnectionStatus>('connecting');
    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        const connect = () => {
            const ws = new WebSocket('ws://localhost:8765');
            wsRef.current = ws;

            ws.onopen = () => {
                console.log('WebSocket connected');
                setStatus('connected');
            };

            ws.onmessage = (event) => {
                try {
                    const data: CounterMessage = JSON.parse(event.data);
                    setCounter(data.counter);
                    const date = new Date(data.timestamp * 1000);
                    setTimestamp(date.toLocaleTimeString());
                    console.log('Received:', data);
                } catch (error) {
                    console.error('Error parsing message:', error);
                }
            };

            ws.onerror = (error) => {
                console.error('WebSocket error:', error);
                setStatus('error');
            };

            ws.onclose = () => {
                console.log('WebSocket disconnected');
                setStatus('disconnected');
                setTimeout(connect, 2000);
            };
        };

        connect();

        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, []);

    const getStatusColor = () => {
        switch (status) {
            case 'connected':
                return 'bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.8)]';
            case 'connecting':
            case 'disconnected':
            case 'error':
                return 'bg-red-500';
        }
    };

    const getStatusText = () => {
        switch (status) {
            case 'connected':
                return 'Connected';
            case 'connecting':
                return 'Connecting...';
            case 'disconnected':
                return 'Disconnected - Reconnecting...';
            case 'error':
                return 'Error';
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-purple-900">
            <div className="text-center bg-white/10 backdrop-blur-md rounded-3xl p-12 shadow-2xl">
                <div className="text-2xl font-light tracking-[0.2em] uppercase opacity-90 text-white mb-4">
                    Counter
                </div>

                <div className="text-[120px] font-bold my-5 text-white drop-shadow-[2px_2px_4px_rgba(0,0,0,0.3)]">
                    {counter ?? '-'}
                </div>

                <div className="text-base mt-5 opacity-70 font-mono text-white">
                    {timestamp}
                </div>

                <div className="mt-8 text-sm opacity-80 text-white flex items-center justify-center gap-2">
                    <span className={`inline-block w-3 h-3 rounded-full ${getStatusColor()}`}></span>
                    <span>{getStatusText()}</span>
                </div>
            </div>
        </div>
    );
};

export default Counter;