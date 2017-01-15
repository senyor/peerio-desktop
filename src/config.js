const cfg = require('~/icebear').config;
const app = require('electron').app || require('electron').remote.app;
const isDevEnv = require('~/helpers/is-dev-env');
const FileStream = require('~/helpers/file-stream');
const tinyDb = require('~/stores/tiny-db');

cfg.appName = 'Icebear';
cfg.updateUrl = 'https://avadakedavra.peerio.com/update';
cfg.currentVersion = app.getVersion();
cfg.socketServerUrl = 'wss://hocuspocus.peerio.com';

cfg.TinyDb = {
    appName: cfg.appName,
    getValue: tinyDb.getValueAsync,
    setValue: tinyDb.setValueAsync,
    removeValue: tinyDb.removeAsync
};

tinyDb.init(cfg.appName);

cfg.FileStream = FileStream;

cfg.stringReplacements = []; // white label only

if (isDevEnv) {
    try {
        cfg.autologin = require('../../autologin.json'); // eslint-disable-line
    } catch (err) {
        // don't care
    }
}

// FOR DEV ENVIRONMENT ONLY
// DEV MACHINE OVERRIDES SOCKET SERVER VALUE WITH THIS
if (process.env.PEERIO_STAGING_SOCKET_SERVER) {
    cfg.socketServerUrl = process.env.PEERIO_STAGING_SOCKET_SERVER;
}

module.exports = cfg;
