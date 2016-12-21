/* eslint-disable global-require, import/newline-after-import */
const { app, BrowserWindow, globalShortcut } = require('electron');
const path = require('path');
const isDevEnv = require('./helpers/is-dev-env');
const config = require('./config');
// For dev builds we want to use separate user data directory
if (isDevEnv) {
    app.setPath('userData', path.resolve(app.getPath('appData'), `${config.appName.toLowerCase()}_dev`));
}
// <UPDATES> -----------------------------------------------------------------------------------------------------
// If the app was started as a part of update process we don't want to proceed with startup
if (require('electron-squirrel-startup')) app.quit();
if (require('./main-process/handle-windows-update')) app.quit();
// </UPDATES> ----------------------------------------------------------------------------------------------------

const devtools = require('./main-process/dev-tools');
const buildContextMenu = require('./main-process/context-menu');
const buildGlobalShortcuts = require('./main-process/global-shortcuts');
const applyMiscHooks = require('./main-process/misc-hooks');
const { saveWindowState, getSavedWindowState } = require('./main-process/state-persistance');
const setMainMenu = require('./main-process/main-menu');

let mainWindow;

app.commandLine.appendSwitch('disable-renderer-backgrounding');

app.on('ready', () => {
    console.log('Electron ready event - Starting app.');
    buildGlobalShortcuts();
    setMainMenu();

    const state = getSavedWindowState();
    mainWindow = new BrowserWindow(Object.assign(state, {
        show: false,
        center: true,
        minWidth: 900,
        minHeight: 728,
        title: config.appName
    }));

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
});

app.on('window-all-closed', () => {
    globalShortcut.unregisterAll();
    app.quit();
});

