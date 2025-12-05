import { app, BrowserWindow } from "electron";
import { spawn } from "child_process";
import type { ChildProcessWithoutNullStreams } from "child_process";
import { fileURLToPath } from "url";
import path from "path";

let pyProcess: ChildProcessWithoutNullStreams | null = null;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function startPython() {
    const pythonScript = path.join(__dirname, "..", "..", "python", "backend.py");
    const venvPython = path.join(__dirname, "..", "..", "python", "venv", "bin", "python3");

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
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, "preload.js")
        }
    });

    win.loadFile(path.join(__dirname, "index.html"));
}

app.whenReady().then(() => {
    startPython();
    createWindow();
});

app.on("window-all-closed", () => {
    if (pyProcess) {
        pyProcess.kill("SIGTERM");
        pyProcess = null;
    }
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("before-quit", () => {
    if (pyProcess) {
        pyProcess.kill("SIGTERM");
        pyProcess = null;
    }
});