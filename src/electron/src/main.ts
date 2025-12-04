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

    pyProcess = spawn("python3", [pythonScript]);

    pyProcess.stdout.on("data", (data) => {
        console.log(`PYTHON: ${data.toString().trim()}`);
    });

    pyProcess.stderr.on("data", (data) => {
        console.error(`PY ERR: ${data.toString()}`);
    });

    pyProcess.on("close", (code) => {
        console.log(`Python backend exited with code ${code}`);
    });
}

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
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
    if (process.platform !== "darwin") {
        pyProcess?.kill("SIGINT");
        app.quit();
    }
});
