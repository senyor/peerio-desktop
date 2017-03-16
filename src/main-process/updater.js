
const { autoUpdater } = require('electron-updater');
const isDevEnv = require('~/helpers/is-dev-env');
const log = require('electron-log');

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';

let window;

function sendStatusToWindow(text) {
    log.info(text);
    window.webContents.send('updater', text);
}

function start(mainWindow) {
    window = mainWindow;
    if (!isDevEnv) {
        autoUpdater.checkForUpdates();
    } else {
        sendStatusToWindow('Updater did not start because dev build was detected.');
    }
}

autoUpdater.on('checking-for-update', () => {
    sendStatusToWindow('Checking for update...');
});

autoUpdater.on('update-available', (ev, info) => {
    sendStatusToWindow('Update available.');
    sendStatusToWindow(JSON.stringify(info));
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
    sendStatusToWindow('Update downloaded. Will install in 5 seconds');
    sendStatusToWindow(JSON.stringify(info));
});

autoUpdater.on('update-downloaded', (ev, info) => {
    sendStatusToWindow(JSON.stringify(info));
    setTimeout(() => {
        autoUpdater.quitAndInstall();
    });
});

module.exports = { start };
