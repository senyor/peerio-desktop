const { shell } = require('electron');
const { isUrlAllowed } = require('../helpers/url');
const certData = require('../cert_fingerprints');

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

    // TODO: new api will be released soon, arguments and callback change a little
    mainWindow.webContents.session.setCertificateVerifyProc((hostname, cert, callback) => {
        console.log('CERTIFICATE VERIFICATION: ', hostname, cert.fingerprint);
        let ret = true;
        certData.forEach((d) => {
            if (hostname.match(d.hostRegex)) {
                ret = d.fingerprint === cert.fingerprint;
            }
        });
        callback(ret);
    });
}

module.exports = applyMiscHooks;
