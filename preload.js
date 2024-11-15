const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  fetchData: () => ipcRenderer.invoke('read-data'),
  addData: (newData) => ipcRenderer.invoke('add-data', newData),
});
