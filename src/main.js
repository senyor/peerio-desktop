if (process.env.NODE_ENV !== 'development') {
    process.env.NODE_ENV = 'production';
}

/* eslint-disable global-require, import/newline-after-import */
const { app, BrowserWindow, globalShortcut } = require('electron');
const path = require('path');

let mainWindow;

process.on('uncaughtException', (error) => {
    console.error('uncaughtException in Node:', error);
});

// On Windows, change user data path from Electron's default
// %APPDATA% to %LOCALAPPDATA%, since we don't want any of our
// local data to be in the Roaming directory, which is synched
// between machines in some corporate environments.
//
// IMPORTANT: this must be done _before_ requiring config.js.
if (
    process.platform === 'win32' &&
    process.env.LOCALAPPDATA // in case we don't have %LOCALAPPDATA% for some reason
) {
    const oldUserData = app.getPath('userData');
    const newUserData = path.join(process.env.LOCALAPPDATA, app.getName());

    if (oldUserData !== newUserData) {
        try {
            // Since we used to store data in %APPDATA%, we need to move
            // all our old data to into a new directory if the new userData
            // directory doesn't exist.
            //
            // This needs to happen before Electron's app 'ready' event.
            // Also, everything needs to be synchronous.
            //
            // XXX: moving can be removed in the future when older versions
            // of the client are deprecated and everyone's updated.
            const fse = require('fs-extra');
            if (!fse.existsSync(newUserData) && fse.existsSync(oldUserData)) {
                fse.moveSync(oldUserData, newUserData);
                console.log(`Moved ${oldUserData} to ${newUserData}`);
            }

            // Set new paths.
            app.setPath('appData', process.env.LOCALAPPDATA);
            app.setPath('userData', newUserData);
        } catch (e) {
            // Failed to move old folder, so continue using it.
            console.error(e);
        }
    }
}

const isDevEnv = require('~/helpers/is-dev-env');
// For dev builds we want to use separate user data directory
if (isDevEnv) {
    app.setPath('userData', path.resolve(app.getPath('appData'), `${app.getName().toLowerCase()}_dev`));
}

// <UPDATES> -----------------------------------------------------------------------------------------------------
// If the app was started as a part of update process we don't want to proceed with startup
if (require('~/main-process/handle-windows-update')) app.quit();
// </UPDATES> ----------------------------------------------------------------------------------------------------

// configure logging
require('~/helpers/logging');

const devtools = require('~/main-process/dev-tools');
const buildContextMenu = require('~/main-process/context-menu');
const buildGlobalShortcuts = require('~/main-process/global-shortcuts');
const applyMiscHooks = require('~/main-process/misc-hooks');
const { saveWindowState, getSavedWindowState } = require('~/main-process/state-persistance');
const setMainMenu = require('~/main-process/main-menu');
const updater = require('./main-process/updater');
const config = require('~/config');


app.commandLine.appendSwitch('disable-renderer-backgrounding');
app.commandLine.appendSwitch('disk-cache-size', 200 * 1024 * 1024);
app.commandLine.appendSwitch('js-flags', '--harmony_regexp_lookbehind');
if (process.env.REMOTE_DEBUG_PORT !== undefined) {
    app.commandLine.appendSwitch('remote-debugging-port', process.env.REMOTE_DEBUG_PORT);
}

app.on('ready', () => {
    console.log('Electron ready event - Starting app.');
    buildGlobalShortcuts();
    setMainMenu();
    app.setAppUserModelId(config.appId);
    config.FileStream.createTempCache()
        .then(getSavedWindowState)
        .then(windowState => {
            const winConfig = Object.assign({
                show: false,
                center: true,
                minWidth: 900,
                minHeight: 728,
                title: app.getName()
            }, windowState);

            if (isDevEnv) {
                winConfig.title = `${winConfig.title} DEV`;
                winConfig.icon = `${__dirname}/static/img/icon-dev.png`;
            } else if (process.platform === 'linux') {
                winConfig.icon = `${__dirname}/static/img/icon.png`;
            }

            mainWindow = new BrowserWindow(winConfig);
            mainWindow.loadURL(`file://${__dirname}/index.html`);

            const rememberWindowState = () => {
                // happens after window is closed
                if (!windowState || !mainWindow) return;
                if (mainWindow.isMaximized()) {
                    windowState.isMaximized = true;
                    return;
                }
                windowState.isMaximized = false;
                if (mainWindow.isMinimized() || mainWindow.isFullScreen()) {
                    // don't remember minimized or fullscreen state.
                    return;
                }
                Object.assign(windowState, mainWindow.getBounds());
            };

            mainWindow.once('ready-to-show', () => {
                mainWindow.show();
                mainWindow.focus();
                if (windowState && windowState.isMaximized) {
                    mainWindow.maximize();
                }
            });

            mainWindow.on('resize', () => {
                rememberWindowState();
            });

            mainWindow.on('maximize', () => {
                rememberWindowState();
            });

            mainWindow.on('unmaximize', () => {
                rememberWindowState();
            });

            mainWindow.on('restore', () => {
                rememberWindowState();
            });

            mainWindow.on('minimize', () => {
                rememberWindowState();
            });

            let closing = false;
            let close = false;
            mainWindow.on('close', e => {
                if (close) return;
                e.preventDefault();
                if (closing) return;
                closing = true;
                saveWindowState(windowState);
                config.FileStream.deleteTempCache()
                    .then(() => {
                        close = true;
                        mainWindow.close();
                    });
            });

            mainWindow.on('closed', () => {
                mainWindow = null;
            });

            applyMiscHooks(mainWindow);
            buildContextMenu(mainWindow);
            devtools.onAppReady(mainWindow);
            updater.start(mainWindow);
        });
});

app.on('window-all-closed', () => {
    globalShortcut.unregisterAll();
    app.quit();
});
