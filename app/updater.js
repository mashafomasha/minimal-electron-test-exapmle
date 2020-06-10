const { autoUpdater } = require("electron-updater");
const log = require('electron-log');
const { app, BrowserWindow, ipcMain } = require('electron');

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
autoUpdater.channel = 'alpha';

app.on('ready', () => {
    try {
        autoUpdater.checkForUpdates();
    } catch (error) {
        log.error(error);
    }
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
    log.error(err);
});

autoUpdater.on('download-progress', (ev, progressObj) => {
    log.info('download-progress', progressObj);
});

autoUpdater.on('update-downloaded', (ev, info) => {
    setTimeout(() => {
        log.info('update-downloaded', info);

        const windows = BrowserWindow.getAllWindows();
        windows.forEach((win) => {
            win.send('update-downloaded');
        });
    }, 3000);
});

ipcMain.once('install-update', () => {
    autoUpdater.quitAndInstall();  
});