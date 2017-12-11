const electron = require('electron');
const config = require('~/config');

const app = electron.app || electron.remote.app;

/**
 * Restarts application
 * @param {[boolean]} force - if true, will restart immediately, no events fired, questions asked,
 *                            no unsaved work saved
 */
function relaunch(force = false) {
    config.FileStream.deleteTempCache();
    app.relaunch();
    force ? app.exit(0) : app.quit();
}

async function signout() {
    const autologin = require('~/helpers/autologin');
    const { User } = require('peerio-icebear');
    await autologin.disable();
    await User.current.signout();
    relaunch();
}

module.exports = { relaunch, signout };
