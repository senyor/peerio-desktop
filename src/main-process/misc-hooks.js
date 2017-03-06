const { shell } = require('electron');

function applyMiscHooks(mainWindow) {
    console.log('Attaching misc webContents hooks.');

    const allowedProtocols = ['HTTP://', 'HTTPS://', 'MAILTO://'];
    function isUrlAllowed(url) {
        if (typeof url !== 'string') return false;
        const URL = url.toUpperCase(url).trim();
        for (let i = 0; i < allowedProtocols.length; i++) {
            if (URL.startsWith(allowedProtocols[i])) return true;
        }
        return false;
    }

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
