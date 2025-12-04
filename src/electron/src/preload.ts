import { contextBridge } from "electron";

contextBridge.exposeInMainWorld("api", {
    // Define APIs later
});
