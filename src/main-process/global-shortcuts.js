// const { globalShortcut } = require('electron');
// const appControl = require('../helpers/app-control');
const L = require('l.js');

function buildGlobalShortcuts() {
    L.info('Registering global shortcuts.');
    // globalShortcut.register('CommandOrControl+R', () => {
    //    appControl.relaunch();
    // });
}

module.exports = buildGlobalShortcuts;
