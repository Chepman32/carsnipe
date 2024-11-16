const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  quitApp: () => ipcRenderer.send('quit-app'),
});