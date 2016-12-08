const cfg = require('./icebear').config; //eslint-disable-line
const app = require('electron').app || require('electron').remote.app;
const isDevEnv = require('./helpers/is-dev-env');

cfg.updateUrl = 'https://leviosa.peerio.com/update';
cfg.currentVersion = app.getVersion();

if (isDevEnv) {
    try {
        cfg.autologin = require('../../autologin.json'); // eslint-disable-line
    } catch (err) {
    // don't care
    }
}

if (process.env.STAGING_SOCKET_SERVER) {
    cfg.socketServerUrl = process.env.STAGING_SOCKET_SERVER;
}

module.exports = cfg;
