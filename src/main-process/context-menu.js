const { Menu, MenuItem } = require('electron');
const appControl = require('~/helpers/app-control');
const devtools = require('~/main-process/dev-tools');

const rightClickPos = { x: 0, y: 0 };


const inputMenu = Menu.buildFromTemplate([
    { role: 'undo' },
    { role: 'redo' },
    { type: 'separator' },
    { role: 'cut' },
    { role: 'copy' },
    { role: 'paste' },
    { type: 'separator' },
    { role: 'selectall' }
]);

const menu = new Menu();

menu.append(new MenuItem({
    label: 'Restart',
    click() {
        appControl.relaunch();
    }
}));

Menu.buildFromTemplate([
    { type: 'separator' },
    { role: 'cut' },
    { role: 'copy' },
    { role: 'paste' },
    { type: 'separator' }
]).items.forEach(i => menu.append(i));

function buildContextMenu(mainWindow) {
    console.log('Building context menu.');

    devtools.extendContextMenu(menu, mainWindow, rightClickPos);

    mainWindow.webContents.on('context-menu', (e, props) => {
        rightClickPos.x = props.x;
        rightClickPos.y = props.y;
        const { selectionText, isEditable } = props;
        if (isEditable) {
            inputMenu.popup(mainWindow);
        } else {
            menu.popup(mainWindow);
        }
    });
}


module.exports = buildContextMenu;
