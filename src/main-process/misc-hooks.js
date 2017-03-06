const { shell } = require('electron');
const { isUrlAllowed } = require('../helpers/url');

function applyMiscHooks(mainWindow) {
    console.log('Attaching misc webContents hooks.');

    // make all attempts to navigate browser window open in external browser
    mainWindow.webContents.on('will-navigate', (e, url) => {
        if (url !== mainWindow.webContents.getURL()) {
            e.preventDefault();
            if (isUrlAllowed(url)) shell.openExternal(url);
        }
    });

    mainWindow.webContents.on('new-window', (e, url) => {
        if (url !== mainWindow.webContents.getURL()) {
            e.preventDefault();
            if (isUrlAllowed(url)) shell.openExternal(url);
        }
    });
}

module.exports = applyMiscHooks;
