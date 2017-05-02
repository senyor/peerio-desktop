const os = require('os');
const cfg = require('~/icebear').config;
const app = require('electron').app || require('electron').remote.app;
const isDevEnv = require('~/helpers/is-dev-env');
const FileStream = require('~/icebear/models/files/node-file-stream');
const StorageEngine = require('~/icebear/models/storage/node-json-storage');
const { setUrlMap, setTagHandler } = require('peerio-translator');
const tagHandlers = require('~/ui/shared-components/translator-tag-handlers');

cfg.appVersion = app.getVersion();
cfg.platform = 'electron';
cfg.arch = os.arch();
cfg.socketServerUrl = 'wss://icebear.peerio.com';
cfg.ghostFrontendUrl = 'https://mail.peerio.com';

// --- TRANSLATOR
cfg.translator = {};
cfg.translator.stringReplacements = []; // white label only
cfg.translator.urlMap = {
    contactFingerprint: 'https://peerio.zendesk.com/hc/en-us/articles/204394135',
    mpDetail: 'https://peerio.zendesk.com/hc/en-us/articles/214633103-What-is-a-Peerio-Master-Password-',
    tfaDetail: 'https://peerio.zendesk.com/hc/en-us/articles/203665635-What-is-two-factor-authentication-',
    msgSignature: 'https://peerio.zendesk.com/hc/en-us/articles/204394135',
    upgrade: 'https://www.peerio.com/pricing.html',
    proWelcome: 'https://peerio.zendesk.com/hc/en-us/articles/208395556',
    proAccount: 'https://account.peerio.com',
    helpCenter: 'https://peerio.zendesk.com/',
    contactSupport: 'https://peerio.zendesk.com/hc/en-us/requests/new'
};


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

// --- DEV ENV SETTINGS
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
    console.log('dev env');
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
