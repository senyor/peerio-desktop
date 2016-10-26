const cfg = require('./icebear').config; //eslint-disable-line
const app = require('electron').app || require('electron').remote.app;

cfg.updateUrl = 'https://leviosa.peerio.com/update';
cfg.currentVersion = app.getVersion();

module.exports = cfg;
