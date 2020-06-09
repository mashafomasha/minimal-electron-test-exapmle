const { app, BrowserWindow, session, ipcMain } = require('electron');
const path = require('path');
const { autoUpdater } = require("electron-updater");
const log = require('electron-log');

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
autoUpdater.channel = 'alpha';

let mainWindow = null;
let offscreenWindow = null;

app.on('ready', () => {
  mainWindow = new BrowserWindow({ show: false, webPreferences: { nodeIntegration: true, contextIsolation: false } });
  offscreenWindow = new BrowserWindow({ show: false, webPreferences: { nodeIntegration: true, contextIsolation: false } });

  mainWindow.loadURL(`file://${__dirname}/index.html`);
  offscreenWindow.show();
  offscreenWindow.loadURL('https://simpl.info/videoalpha/video/soccer1.webm');

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.webContents.toggleDevTools();

    autoUpdater.checkForUpdates();
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
    mainWindow = null;
    offscreenWindow = null;
  });
});

autoUpdater.on('checking-for-update', () => {
  log.info('checking-for-update');
});
autoUpdater.on('update-available', (ev, info) => {
  log.info('update-available', info);
});
autoUpdater.on('update-not-available', (ev, info) => {
  log.info('update-not-available', info);
});
autoUpdater.on('error', (ev, err) => {
  log.info('error', err);
});
autoUpdater.on('download-progress', (ev, progressObj) => {
  log.info('download-progress', progressObj);
});
autoUpdater.on('update-downloaded', (ev, info) => {
  log.info('update-downloaded', info);

  setTimeout(function() {
    autoUpdater.quitAndInstall();  
  }, 5000);
});
