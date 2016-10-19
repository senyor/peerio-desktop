/* eslint-disable global-require, import/newline-after-import */
const { app, BrowserWindow, Menu, shell } = require('electron');
const storage = require('./stores/tiny-db');
const isDevEnv = process.env.NODE_ENV !== 'production';

if (isDevEnv) {
    //eslint-disable-next-line
    require('electron-reload')(__dirname , { electron: require('electron-prebuilt') });
}
let mainWindow;

app.on('ready', onAppReady);
//
// app.on('window-all-closed',);
// this event is fired before all windows are closed
// app.on('before-quit', event =>{} );
// this event is fired after all windows are closed
// app.on('will-quit', event =>{});
// app.on('quit', (event, exitCode) =>{});

function onAppReady() {
    const state = getSavedWindowState();
    mainWindow = new BrowserWindow(Object.assign(state, { show: false }));
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

    // make all attempts to navigate browser window open in external browser
    mainWindow.webContents.on('will-navigate', (e, url) => {
        if (url !== mainWindow.webContents.getURL()) {
            e.preventDefault();
            shell.openExternal(url);
        }
    });


    mainWindow.webContents.openDevTools();
    if (isDevEnv) {
        enableDevModeOnWindow(mainWindow);
    }
}

function saveWindowState(state) {
    storage.set('windowState', state);
}

function getSavedWindowState() {
    const defaultState = {
        width: 1024,
        height: 728
    };
    const savedState = storage.get('windowState');
    return Object.assign(defaultState, savedState || {});
}

// dev mode
function enableDevModeOnWindow(win) {
    win.openDevTools();
    installExtensions();
    win.webContents.on('context-menu', (e, props) => {
        const { x, y } = props;

        Menu.buildFromTemplate([
            {
                label: 'Inspect element',
                click() {
                    win.inspectElement(x, y);
                }
            }
        ]).popup(win);
    });
}

// dev mode
function installExtensions(forceReinstall) {
    console.log('installing extensions');
    const devtron = require('devtron'); // eslint-disable-line import/no-extraneous-dependencies

    if (forceReinstall) {
        devtron.uninstall();
    }
    devtron.install();

    const installer = require('electron-devtools-installer'); // eslint-disable-line import/no-extraneous-dependencies
    const extensions = ['REACT_DEVELOPER_TOOLS', 'REACT_PERF'];
    for (const name of extensions) {
        console.log('installing %s', name);
        try {
            installer.default(installer[name], forceReinstall);
        } catch (e) {
            console.error("Failed to install extension '%s'", name, e);
        }
    }
}
