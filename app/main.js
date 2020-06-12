const { app, BrowserWindow, session, ipcMain } = require('electron');
const path = require('path');

let mainWindow = null;
let offscreenWindow = null;

if (process.env.NODE_ENV !== 'development') {
  require('./updater.js');
}

app.on('ready', () => {
  mainWindow = new BrowserWindow({ show: false, webPreferences: { nodeIntegration: true, contextIsolation: false } });
  offscreenWindow = new BrowserWindow({ show: false, webPreferences: { nodeIntegration: true, contextIsolation: false }, frame: false, transparent: true });

  mainWindow.loadURL(`file://${__dirname}/index.html`);
  // offscreenWindow.show();
  offscreenWindow.loadURL('https://simpl.info/videoalpha/video/soccer1.webm');

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.webContents.toggleDevTools();
  });

  ipcMain.on('capture', () => {
    if (offscreenWindow) {
      const focused = BrowserWindow.getFocusedWindow();
      console.log(focused);

      if (focused) {
        const offscreen = BrowserWindow.getAllWindows().find((window) => window.id !== focused.id);

        if (offscreen) {
          focused.webContents.send('window-id', { id: offscreen.id });
        }
      }
    }
  });

  mainWindow.on('closed', () => {
    offscreenWindow.close();

    mainWindow = null;
    offscreenWindow = null;
  });
});
