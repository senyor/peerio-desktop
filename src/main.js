/* eslint-disable global-require, import/newline-after-import */
const { app, BrowserWindow, globalShortcut } = require('electron');
const path = require('path');
global.L = require('l.js');

let appReady = false;
let mainWindow;

process.on('uncaughtException', (error) => {
    console.error('uncaughtException in Node:', error);
});

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

app.on('ready', () => {
    console.log('Electron ready event - Starting app.');
    buildGlobalShortcuts();
    setMainMenu();
    app.setAppUserModelId(config.appId);

    getSavedWindowState()
        .then(state => {
            const winConfig = Object.assign(state, {
                show: false,
                center: true,
                minWidth: 900,
                minHeight: 728,
                title: app.getName()
            });

            if (process.platform === 'linux') {
                state.icon = `${__dirname}/static/img/icon.png`;
            }

            mainWindow = new BrowserWindow(winConfig);
            appReady = true;
            mainWindow.loadURL(`file://${__dirname}/index.html`);

            mainWindow.once('ready-to-show', () => {
                mainWindow.show();
                mainWindow.focus();
            });

            mainWindow.on('close', () => {
                const bounds = mainWindow.getBounds();
                saveWindowState(bounds);
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

