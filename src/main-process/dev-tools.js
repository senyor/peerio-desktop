const { MenuItem } = require('electron');
const L = require('l.js');
const isDevEnv = require('~/helpers/is-dev-env');
const path = require('path');

const appRootPath = path.resolve(`${__dirname}/../`);
const repoRootPath = path.resolve(`${__dirname}/../../../`);

// restart electron when files changed in dev mode
if (isDevEnv) {
    const PATH_APP_NODE_MODULES = path.join(repoRootPath, 'app', 'node_modules');
    require('module').globalPaths.push(PATH_APP_NODE_MODULES);
    //eslint-disable-next-line
    require('electron-reload')(appRootPath, {
        electron: path.join(repoRootPath, 'node_modules', '.bin', 'electron')
    });
}

function onAppReady(mainWindow) {
    if (!isDevEnv) return;
    L.info('Initializing development tools.');
    installExtensions();
    mainWindow.openDevTools();
}

function installExtensions(forceReinstall) {
    L.info('installing extensions.');
    const devtron = require('devtron');

    if (forceReinstall) {
        devtron.uninstall();
    }
    devtron.install();

    const installer = require('electron-devtools-installer');
    const extensions = ['REACT_DEVELOPER_TOOLS', 'REACT_PERF'];
    for (const name of extensions) {
        L.info(`installing ${name}`);
        try {
            installer.default(installer[name], forceReinstall);
        } catch (e) {
            L.error(`Failed to install extension ${name} with error ${e}`);
        }
    }
}

function extendContextMenu(menu, mainWindow, rightClickPos) {
    L.info('Extending context menu with dev tools.');
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
