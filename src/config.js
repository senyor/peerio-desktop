const cfg = require('./icebear').config; //eslint-disable-line
const app = require('electron').app || require('electron').remote.app;

cfg.updateUrl = 'https://leviosa.peerio.com/update';
cfg.currentVersion = app.getVersion();

if (process.env.NODE_ENV !== 'production') {
    try {
        cfg.autologin = require('../autologin.json'); // eslint-disable-line
    } catch (err) {
    // don't care
    }
}

module.exports = cfg;
