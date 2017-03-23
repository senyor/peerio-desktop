const os = require('os');
const cfg = require('~/icebear').config;
const app = require('electron').app || require('electron').remote.app;
const isDevEnv = require('~/helpers/is-dev-env');
const FileStream = require('~/icebear/models/files/node-file-stream');
const StorageEngine = require('~/icebear/models/storage/node-json-storage');

cfg.updateUrl = 'https://avadakedavra.peerio.com/update';
cfg.appVersion = app.getVersion();
cfg.platform = 'electron';
cfg.arch = os.arch();
cfg.ghostFrontendUrl = 'https://mail.peerio.com/';
cfg.socketServerUrl = 'wss://icebear.peerio.com';
cfg.fingerprintUrl = 'https://peerio.zendesk.com/hc/en-us/articles/204394135';
cfg.mpDetailUrl = 'https://peerio.zendesk.com/hc/en-us/articles/214633103-What-is-a-Peerio-Master-Password-';
cfg.tfaDetailUrl = 'https://peerio.zendesk.com/hc/en-us/articles/203665635-What-is-two-factor-authentication-';
cfg.msgSignatureUrl = 'https://peerio.zendesk.com/hc/en-us/articles/204394135'
// cfg.ghostFrontendUrl = 'https://alakazam.peerio.com/';

cfg.FileStream = FileStream;
cfg.StorageEngine = StorageEngine;
cfg.StorageEngine.storageFolder = app.getPath('userData');

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
if (isDevEnv && process.env.PEERIO_STAGING_SOCKET_SERVER) {
    cfg.socketServerUrl = process.env.PEERIO_STAGING_SOCKET_SERVER;
}

module.exports = cfg;
