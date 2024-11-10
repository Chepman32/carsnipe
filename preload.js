const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('api', {
  // Expose only the methods you need
});