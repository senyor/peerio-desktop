const cfg = require('~/config');

/**
 * Keytar is a native module and we suspect it might not always work as expected.
 * Keytar malfunction is not blocking user from using the app so we'll try to handle errors gracefully.
 * The purpose of this module is to wrap keytar API into more suitable to us manner.
 */
let keytar;
try {
    keytar = require('keytar');
} catch (err) {
    console.error('Keytar error', err);
}

const service = cfg.keychainService;

async function saveSecret(username, passphrase) {
    if (!keytar) return Promise.resolve(false);
    try {
        await keytar.setPassword(service, username, passphrase);
        return Promise.resolve(true);// we want bluebird promises
    } catch (err) {
        console.error('Error setting passphrase with keytar', err);
        return Promise.resolve(false);
    }
}

async function getSecret(username) {
    if (!keytar) return Promise.resolve(false);
    try {
        const ret = await keytar.getPassword(service, username);
        return ret || Promise.resolve(false);
    } catch (err) {
        console.error('Error getting passphrase with keytar', err);
        return Promise.resolve(false);
    }
}

async function removeSecret(username) {
    if (!keytar) return Promise.resolve(false);
    try {
        await keytar.deletePassword(service, username);
        return Promise.resolve(true);
    } catch (err) {
        console.error('Error getting passphrase with keytar', err);
        return Promise.resolve(false);
    }
}

module.exports = {
    saveSecret: Promise.method(saveSecret),
    getSecret: Promise.method(getSecret),
    removeSecret: Promise.method(removeSecret)
};
