const cfg = require('~/icebear').config;
const app = require('electron').app || require('electron').remote.app;
const isDevEnv = require('~/helpers/is-dev-env');
const FileStream = require('~/helpers/file-stream');
const KeyValueStorage = require('~/stores/key-value-storage');

cfg.appName = 'Icebear';
cfg.updateUrl = 'https://avadakedavra.peerio.com/update';
cfg.currentVersion = app.getVersion();
cfg.socketServerUrl = 'wss://hocuspocus.peerio.com';
cfg.ghostFrontendUrl = 'https://alakazam.peerio.com/';

cfg.StorageEngine = KeyValueStorage;
cfg.FileStream = FileStream;

cfg.download.maxDownloadChunkSize = 1024 * 1024 * 3;
cfg.download.maxDecryptBufferSize = 1024 * 1024 * 3;
cfg.upload.encryptBufferSize = 1024 * 1024 * 3;
cfg.upload.uploadBufferSize = 1024 * 1024 * 3;

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
