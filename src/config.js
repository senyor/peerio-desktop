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

cfg.upload = {
    chunkSize: 1024 * 512,
    maxEncryptQueue: 2, // max amount of chunks to pre-buffer for upload
    maxUploadQueue: 2, // max amount of chunks to pre-encrypt for sending
    maxResponseQueue: 2 // max amount of uploaded chunks waiting for server response
};

cfg.download = {
    chunkSize: 1024 * 1100, // amount of bytes to download at once for further processing
    maxParseQueue: 5,  // max amount of chunks to pre-buffer (download)
    maxDecryptQueue: 5  // max amount of chunks to extract and queue for decrypt
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
