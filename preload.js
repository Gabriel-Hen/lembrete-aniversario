const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  obterDados: () => ipcRenderer.invoke('read-data'),
  adicionar: (newData) => ipcRenderer.invoke('add-data', newData),
  sobrescrever: (newData) => ipcRenderer.invoke('overwrite-data', newData),
});
