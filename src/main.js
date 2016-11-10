/* eslint-disable global-require, import/newline-after-import */
const { app, BrowserWindow, Menu, shell, globalShortcut } = require('electron');
const db = require('./stores/tiny-db');

const isDevEnv = process.env.NODE_ENV !== 'production';

if (require('electron-squirrel-startup')) app.quit();
if (handleSquirrelEvent()) console.log('Squirrel update!');

// restart electron when files changed in dev mode
if (isDevEnv) {
    //eslint-disable-next-line
    require('electron-reload')(__dirname, { electron: require('electron-prebuilt') });
}

let mainWindow;

app.on('ready', onAppReady);

app.on('window-all-closed', () => {
    globalShortcut.unregisterAll();
    app.quit();
});

function onAppReady() {
    globalShortcut.register('CommandOrControl+R', () => {
        require('./helpers/app-control').relaunch();
    });
    console.log('Starting app.');
    const state = getSavedWindowState();
    mainWindow = new BrowserWindow(Object.assign(state, {
        show: false,
        minWidth: 900,
        minHeight: 728
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

    // make all attempts to navigate browser window open in external browser
    mainWindow.webContents.on('will-navigate', (e, url) => {
        if (url !== mainWindow.webContents.getURL()) {
            e.preventDefault();
            shell.openExternal(url);
        }
    });

    if (isDevEnv) {
        enableDevModeOnWindow(mainWindow);
    } else enableDevModeOnWindow(mainWindow, true);
}

function saveWindowState(state) {
    db.set('windowState', state);
}

function getSavedWindowState() {
    const defaultState = {
        width: 1024,
        height: 728
    };
    const savedState = db.get('windowState');
    return Object.assign(defaultState, savedState || {});
}

// dev mode
function enableDevModeOnWindow(win, onlyMenu) {
    if (!onlyMenu) {
        win.openDevTools();
        installExtensions();
    }
    win.webContents.on('context-menu', (e, props) => {
        const { x, y } = props;

        Menu.buildFromTemplate([
            {
                label: 'Inspect element',
                click() {
                    win.inspectElement(x, y);
                }
            },
            {
                label: 'Restart',
                accelerator: 'CommandOrControl+R',
                click() {
                    require('./helpers/app-control').relaunch();
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

/**
 * Completely stock squirrel installer code. Runs the installer and seamlessly installs the app.
 *
 * @todo replace the animation.
 * @returns {boolean} true if squirrel update is a go
 */
function handleSquirrelEvent() {
    if (process.argv.length === 1) {
        return false;
    }

    const ChildProcess = require('child_process');
    const path = require('path');
    const appFolder = path.resolve(process.execPath, '..');
    const rootAtomFolder = path.resolve(appFolder, '..');
    const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
    const exeName = path.basename(process.execPath);

    const spawn = function(command, args) {
        let spawnedProcess, error;

        try {
            spawnedProcess = ChildProcess.spawn(command, args, { detached: true });
        } catch (err) {
            console.log(err);
        }

        return spawnedProcess;
    };

    const spawnUpdate = function(args) {
        return spawn(updateDotExe, args);
    };

    const squirrelEvent = process.argv[1];
    switch (squirrelEvent) {
        case '--squirrel-install':
        case '--squirrel-updated':
            spawnUpdate(['--createShortcut', exeName]);
            setTimeout(app.quit, 1000);
            return true;
        case '--squirrel-uninstall':
            spawnUpdate(['--removeShortcut', exeName]);
            setTimeout(app.quit, 1000);
            return true;
        case '--squirrel-obsolete':
            app.quit();
            return true;
        default:
            return false;
    }
}
