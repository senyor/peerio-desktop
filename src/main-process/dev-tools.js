const { MenuItem } = require('electron');
const isDevEnv = require('~/helpers/is-dev-env');
const path = require('path');
const appControl = require('~/helpers/app-control');

const appRootPath = path.resolve(`${__dirname}/../`); // app/build
const repoRootPath = path.resolve(`${__dirname}/../../../`);
// restart electron when files changed in dev mode
if (isDevEnv) {
    const PATH_APP_NODE_MODULES = path.join(repoRootPath, 'app', 'node_modules');
    require('module').globalPaths.push(PATH_APP_NODE_MODULES);
    const watchPaths = [
        appRootPath,
        path.join(PATH_APP_NODE_MODULES, 'peerio-icebear', 'dist')
    ];
    console.log('electron-reload watching:', watchPaths);
    require('electron-reload')(watchPaths, {
        electron: path.join(repoRootPath, 'node_modules', '.bin', 'electron'),
        ignored: false
    });
}

function onAppReady(mainWindow) {
    if (!isDevEnv) return;
    console.log('Initializing development tools.');
    installExtensions();
    if (process.env.REMOTE_DEBUG_PORT === undefined) {
        mainWindow.openDevTools();
    }
}

function installExtensions() {
    console.log('installing extensions.');
    const devtron = require('devtron');
    devtron.install();

    const {
        default: install,
        REACT_DEVELOPER_TOOLS,
        REACT_PERF,
        MOBX_DEVTOOLS
    } = require('electron-devtools-installer');

    install([REACT_DEVELOPER_TOOLS, REACT_PERF, MOBX_DEVTOOLS])
        .then((name) => console.log(`Added Extension:  ${name}`))
        .catch((err) => console.log('An error occurred: ', err));
}

function extendContextMenu(menu, mainWindow, rightClickPos) {
    console.log('Extending context menu with dev tools.');
    menu.append(new MenuItem({ type: 'separator' }));
    menu.append(new MenuItem({
        label: 'Restart',
        click() {
            appControl.relaunch();
        }
    }));
    menu.append(new MenuItem({ type: 'separator' }));
    menu.append(new MenuItem({
        label: '🔧 Dev tools',
        click() {
            mainWindow.webContents.send('router', '/dev-tools');
        }
    }));
    menu.append(new MenuItem({
        label: '🔃 Reload page',
        accelerator: 'CommandOrControl+R',
        role: 'reload',
        click() {
            mainWindow.reload();
        }
    }));
    menu.append(new MenuItem({
        label: '☝️ Inspect Element',
        click() {
            mainWindow.inspectElement(rightClickPos.x, rightClickPos.y);
        }
    }));
}

module.exports = { onAppReady, extendContextMenu };
