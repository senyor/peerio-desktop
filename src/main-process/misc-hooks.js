const { shell } = require('electron');

function applyMiscHooks(mainWindow) {
    console.log('Attaching misc webContents hooks.');
    // make all attempts to navigate browser window open in external browser
    mainWindow.webContents.on('will-navigate', (e, url) => {
        if (url !== mainWindow.webContents.getURL()) {
            e.preventDefault();
            shell.openExternal(url);
        }
    });
}

module.exports = applyMiscHooks;
