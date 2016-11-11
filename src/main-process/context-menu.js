const { Menu, MenuItem } = require('electron');
const appControl = require('../helpers/app-control');
const devtools = require('../main-process/dev-tools');

function buildContextMenu(mainWindow) {
    console.log('Building context menu.');
    const menu = new Menu();

    menu.append(new MenuItem({
        label: 'Restart',
        accelerator: 'CommandOrControl+R',
        click() {
            appControl.relaunch();
        }
    }));

    devtools.extendContextMenu(menu);

    mainWindow.webContents.on('context-menu', () => {
        menu.popup(mainWindow);
    });
}


module.exports = buildContextMenu;
