const { MenuItem } = require('electron');
const isDevEnv = require('../helpers/is-dev-env');

let mainWindow;
// restart electron when files changed in dev mode
if (isDevEnv) {
    //eslint-disable-next-line
    require('electron-reload')(__dirname, { electron: require('electron-prebuilt') });
}

function onAppReady(mainWin) {
    if (!isDevEnv) return;
    console.log('Initializing development tools.');
    mainWindow = mainWin;
    installExtensions();
    mainWindow.openDevTools();
}

function installExtensions(forceReinstall) {
    console.log('installing extensions.');
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

function extendContextMenu(menu) {
    // todo: uncomment when going to prod
    // if (!isDevEnv) return;
    console.log('Extending context menu with dev tools.');
    menu.append(new MenuItem({ type: 'separator' }));
    menu.append(new MenuItem({
        label: 'Reload page',
        click() {
            mainWindow.reload();
        }
    }));
    menu.append(new MenuItem({
        label: 'Dev Tools',
        click() {
            mainWindow.toggleDevTools();
        }
    }));
}

module.exports = { onAppReady, extendContextMenu };
