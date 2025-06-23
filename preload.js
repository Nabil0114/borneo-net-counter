const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  openFile: () => ipcRenderer.invoke('open-file'),
  saveFile: (data) => ipcRenderer.invoke('save-file', data),
  copyToClipboard: (text) => ipcRenderer.send('copy-to-clipboard', text),
  moveWindow: (pos) => ipcRenderer.send('move-window', pos),
  closeApp: () => ipcRenderer.send('close-app')
});
