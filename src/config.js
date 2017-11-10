const os = require('os');
const path = require('path');
const cfg = require('~/icebear').config;
const app = require('electron').app || require('electron').remote.app;
const isDevEnv = require('~/helpers/is-dev-env');
const FileStream = require('~/icebear/models/files/node-file-stream');
const StorageEngine = require('~/icebear/models/storage/node-json-storage');
const { setUrlMap, setTagHandler } = require('peerio-translator');
const tagHandlers = require('~/ui/shared-components/translator-tag-handlers');

const packageJson = require(path.join(app.getAppPath(), 'package.json'));
if (!packageJson) {
    throw new Error(`Unable to find package.json (resources path: ${process.resourcesPath})`);
}
if (!packageJson.peerio) {
    throw new Error('Missing "peerio" in package.json');
}

Object.assign(cfg, packageJson.peerio);

cfg.appVersion = app.getVersion();
cfg.platform = 'electron';
cfg.arch = os.arch();
cfg.os = os.type();

setUrlMap(cfg.translator.urlMap);
for (const name in tagHandlers) {
    setTagHandler(name, tagHandlers[name]);
}

// --- PLATFORM SPECIFIC IMPLEMENTATIONS
cfg.FileStream = FileStream;
cfg.StorageEngine = StorageEngine;
cfg.StorageEngine.storageFolder = app.getPath('userData');

// --- FILE UPLOAD/DOWNLOAD SETTINGS
cfg.download.maxDownloadChunkSize = 1024 * 1024 * 3;
cfg.download.maxDecryptBufferSize = 1024 * 1024 * 3;
cfg.upload.encryptBufferSize = 1024 * 1024 * 3;
cfg.upload.uploadBufferSize = 1024 * 1024 * 3;

// --- PERFORMANCE
cfg.chat.maxInitialChats = 20;

// --- IMAGE DISPLAY LIMITS
cfg.chat.inlineImageSizeLimit = 10 * 1024 * 1024;
cfg.chat.inlineImageSizeLimitCutoff = 30 * 1024 * 1024;

// --- DEBUG
cfg.nodeLogFolder = path.join(app.getPath('userData'), 'logs');

// --- DEV ENV SETTINGS
if (isDevEnv) {
    try {
        cfg.devAutologin = require('../../autologin.json'); // eslint-disable-line
    } catch (err) {
        // don't care
    }
}

// FOR DEV ENVIRONMENT ONLY
// DEV MACHINE OVERRIDES SOCKET SERVER VALUE WITH THIS
if (isDevEnv && process.env.PEERIO_STAGING_SOCKET_SERVER) {
    cfg.socketServerUrl = process.env.PEERIO_STAGING_SOCKET_SERVER;
}

// --- DIAGNOSTIC STARTUP LOG
try {
    console.log(isDevEnv ? 'DEV environment detected' : 'PROD environment detected');
    console.log(`Starting app: v${cfg.appVersion} | ${cfg.arch} | ${cfg.platform} | ` +
        `${os.platform()}-${os.release()} | ${os.cpus().length} CPUs | ` +
        `${os.totalmem() / 1024 / 1024 / 1024}GB RAM (${+(os.freemem() / 1024 / 1024 / 1024).toFixed(2)}GB free) | ` +
        `${Math.round(os.uptime() / 60 / 60)} hours uptime`);
} catch (err) {
    console.log(err);
}


module.exports = cfg;
