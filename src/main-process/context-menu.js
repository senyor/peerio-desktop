const { Menu, MenuItem } = require('electron');
const appControl = require('~/helpers/app-control');
const devtools = require('~/main-process/dev-tools');

const rightClickPos = { x: 0, y: 0 };

function buildContextMenu(mainWindow) {
    console.log('Building context menu.');
    const menu = new Menu();

    menu.append(new MenuItem({
        label: 'Restart',
        click() {
            appControl.relaunch();
        }
    }));

    devtools.extendContextMenu(menu, mainWindow, rightClickPos);

    mainWindow.webContents.on('context-menu', (e, props) => {
        rightClickPos.x = props.x;
        rightClickPos.y = props.y;
        menu.popup(mainWindow);
    });
}


module.exports = buildContextMenu;
