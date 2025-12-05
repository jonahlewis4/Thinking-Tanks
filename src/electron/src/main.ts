// src/main.ts
import { app, BrowserWindow } from "electron";
import { spawn } from "child_process";
import type { ChildProcessWithoutNullStreams } from "child_process";
import { fileURLToPath } from "url";
import path from "path";

let pyProcess: ChildProcessWithoutNullStreams | null = null;
let mainWindow: BrowserWindow | null = null;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = process.env["NODE_ENV"] === 'development';

function startPython() {
    const projectRoot = path.join(__dirname, "..", "..");
    const pythonScript = path.join(projectRoot, "python", "backend.py");
    const venvPython = path.join(projectRoot, "python", "venv", "bin", "python3");

    console.log("Python script path:", pythonScript);
    console.log("Python executable:", venvPython);

    try {
        pyProcess = spawn(venvPython, [pythonScript], {
            stdio: ['pipe', 'pipe', 'pipe']
        });

        pyProcess.stdout.on("data", (data) => {
            console.log(`PYTHON: ${data.toString().trim()}`);
        });

        pyProcess.stderr.on("data", (data) => {
            console.error(`PY ERR: ${data.toString()}`);
        });

        pyProcess.on("error", (error) => {
            console.error("Failed to start Python process:", error);
        });

        pyProcess.on("close", (code, signal) => {
            console.log(`Python backend exited with code ${code}, signal ${signal}`);
            pyProcess = null;
        });
    } catch (error) {
        console.error("Error spawning Python process:", error);
    }
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    if (isDev) {
        mainWindow.loadURL('http://localhost:3000');
        mainWindow.webContents.openDevTools();
    } else {
        mainWindow.loadFile(path.join(__dirname, 'index.html'));
    }

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}


const startApp = () => {
    startPython();
    createWindow();
};

app.whenReady().then(() => {
    startApp();
});

const closePythonIfOpen = () => {
    if (pyProcess) {
        pyProcess.kill("SIGTERM");
        pyProcess = null;
    }
}

app.on("window-all-closed", () => {
    closePythonIfOpen();
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("will-quit", () => {
    closePythonIfOpen();
});
