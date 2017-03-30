
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
    try {
        window = mainWindow;
        autoUpdater.setFeedURL({
            // this is a temporary, read-only token with access to repository that will be public soon
            // remove when switching to public release
            token: '4d60ee659c9a6c21efe949ab42ba968663db86ee',
            provider: 'github',
            owner: 'PeerioTechnologies',
            repo: 'peerio-desktop'
        });

        if (!isDevEnv) {
            autoUpdater.checkForUpdates();
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
