
const isDevEnv = require('~/helpers/is-dev-env');
const { ipcMain } = require('electron');
const config = require('~/config-base');
const { TinyDb } = require('~/icebear');

let autoUpdater;
if (process.platform === 'linux') {
    autoUpdater = require('@peerio/updater')();
} else {
    autoUpdater = require('electron-updater').autoUpdater;
}

// autoUpdater.logger = L;
TinyDb.system.getValue('pref_prereleaseUpdatesEnabled')
    .then(enabled => {
        autoUpdater.allowPrerelease = !!enabled;
        console.log(`Prerelease updates are ${autoUpdater.allowPrerelease ? 'enabled' : 'disabled'}`);
    }).catch(err => {
        console.error('Failed to retrieve prerelease update setting from TinyDb', err);
    });

let window;

function sendStatusToWindow(text) {
    console.log(text);
    window.webContents.send('console_log', text);
}

function start(mainWindow) {
    try {
        window = mainWindow;
        if (process.platform !== 'linux' && config.updateFeedUrl) {
            autoUpdater.setFeedURL(config.updateFeedUrl);
        }
        ipcMain.on('install-update', () => {
            console.log('Client approved update installation.');
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
