const { app, BrowserWindow, ipcMain, dialog, clipboard } = require('electron');
const path = require('path');
const fs = require('fs');

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 300,
    height: 80,
    resizable: false,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  win.loadFile('renderer.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// IPC for file open dialog
ipcMain.handle('open-file', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog(win, {
    filters: [{ name: 'Text Files', extensions: ['txt'] }],
    properties: ['openFile']
  });
  if (canceled || filePaths.length === 0) return null;
  const content = fs.readFileSync(filePaths[0], 'utf8');
  return content;
});

// IPC for file save dialog
ipcMain.handle('save-file', async (event, data) => {
  const { canceled, filePath } = await dialog.showSaveDialog(win, {
    filters: [{ name: 'Text Files', extensions: ['txt'] }],
    defaultPath: "counter.txt"
  });
  if (canceled || !filePath) return false;
  fs.writeFileSync(filePath, data, 'utf8');
  return true;
});

// IPC for clipboard
ipcMain.on('copy-to-clipboard', (event, text) => {
  clipboard.writeText(text);
});

// Window drag (handled in renderer)
ipcMain.on('move-window', (event, { x, y }) => {
  win.setPosition(x, y);
});

// Close app
ipcMain.on('close-app', () => {
  app.quit();
});
