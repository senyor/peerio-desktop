const electron = require('electron');

const app = electron.app || electron.remote.app;

/**
 * Restarts application
 * @param {[boolean]} force - if true, will restart immediately, no events fired, questions asked,
 *                            no unsaved work saved
 */
function relaunch(force) {
    app.relaunch();
    force ? app.exit(0) : app.quit();
}

module.exports = { relaunch };
