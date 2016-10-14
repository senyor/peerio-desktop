/* eslint-disable global-require, import/newline-after-import */
const { app, BrowserWindow, Menu } = require('electron');
const storage = require('electron-json-storage');
const isDevEnv = process.env.NODE_ENV !== 'production';

if (isDevEnv) {
    //eslint-disable-next-line
    require('electron-reload')(__dirname/* , { electron: require('electron-prebuilt') }*/);
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
    getSavedWindowState().then((state) => {
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

        if (isDevEnv) {
            mainWindow.webContents.openDevTools();
            enableDevModeOnWindow(mainWindow);
        }
    });
}

function saveWindowState(state) {
    console.log('Saving window state: ', state);
    return new Promise((resolve) => {
        storage.set('windowState', state, (error) => {
            if (error) {
                console.error(error);
            }
            resolve();
        });
    });
}

function getSavedWindowState() {
    console.log('!Loading window state');
    return new Promise((resolve) => {
        const winState = {
            width: 1024,
            height: 728
        };
        storage.get('windowState', (error, data) => {
            if (error) {
                console.error(error);
                resolve(winState);
            }
            console.log('Got saved window state: ', data);
            Object.assign(winState, data);
            console.log('Merged windows state: ', data);
            resolve(data);
        });
    });
}

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
