
const { autoUpdater } = require('electron-updater');
const isDevEnv = require('~/helpers/is-dev-env');
const log = require('electron-log');
const { ipcMain } = require('electron');

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';

let window;

function sendStatusToWindow(text) {
    log.info(text);
    window.webContents.send('console_log', text);
}

function start(mainWindow) {
    try {
        window = mainWindow;
        autoUpdater.setFeedURL('https://betaupdate.peerio.com');
        ipcMain.on('install-update', () => {
            log.info('Client approved update installation.');
            autoUpdater.quitAndInstall();
        });
        if (!isDevEnv) {
            setTimeout(() => autoUpdater.checkForUpdates(), 3000);
            setInterval(() => autoUpdater.checkForUpdates(), 60 * 60 * 1000);
        } else {
            sendStatusToWindow('Updater did not start because dev build was detected.');
        }
    } catch (ex) {
        sendStatusToWindow('Error starting updater.');
        sendStatusToWindow(JSON.stringify(ex));
    }
}

autoUpdater.on('checking-for-update', () => {
    sendStatusToWindow('Checking for update...');
});

autoUpdater.on('update-available', (ev, info) => {
    sendStatusToWindow('Update available.');
    sendStatusToWindow(JSON.stringify(info));
    window.webContents.send('warning', 'title_updateDownloading');
});

autoUpdater.on('update-not-available', (ev, info) => {
    sendStatusToWindow('Update not available.');
    sendStatusToWindow(JSON.stringify(info));
});

autoUpdater.on('error', (ev, err) => {
    sendStatusToWindow('Error in auto-updater.');
    sendStatusToWindow(JSON.stringify(err));
});

autoUpdater.on('download-progress', (ev, progressObj) => {
    sendStatusToWindow('Download progress...');
    sendStatusToWindow(JSON.stringify(progressObj));
});

autoUpdater.on('update-downloaded', (ev, info) => {
    sendStatusToWindow('Update downloaded.');
    sendStatusToWindow(JSON.stringify(info));
    window.webContents.send('update-will-restart');
});

module.exports = { start };
