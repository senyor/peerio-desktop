const electron = require('electron');
const autologin = require('~/helpers/autologin');
const { User } = require('~/icebear');

const app = electron.app || electron.remote.app;

/**
 * Restarts application
 * @param {[boolean]} force - if true, will restart immediately, no events fired, questions asked,
 *                            no unsaved work saved
 */
function relaunch(force = false) {
    app.relaunch();
    force ? app.exit(0) : app.quit();
}

async function signout() {
    await autologin.disable();
    await User.current.signout();
    relaunch();
}

module.exports = { relaunch, signout };
