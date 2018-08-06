// We import the keytar module here for typechecking but don't use it yet; this
// statement should be removed by the compiler. (We could alternately use
// `typeof import('keytar')` syntax, but @babel/plugin-transform-typescript
// doesn't support it yet; see https://github.com/babel/babel/issues/7749.)
import Keytar from 'keytar';

import cfg from '~/config';

/**
 * Keytar is a native module and we suspect it might not always work as expected.
 * Keytar malfunction is not blocking user from using the app so we'll try to handle errors gracefully.
 * The purpose of this module is to wrap keytar API into more suitable to us manner.
 */
let keytar: typeof Keytar;
try {
    keytar = require('keytar');
} catch (err) {
    console.error('Keytar error', err);
}

const service = cfg.keychainService;

export async function saveSecret(
    username: string,
    passphrase: string
): Promise<boolean> {
    if (!keytar) return Promise.resolve(false);
    try {
        await keytar.setPassword(service, username, passphrase);
        return Promise.resolve(true); // we want bluebird promises
    } catch (err) {
        console.error('Error setting passphrase with keytar', err);
        return Promise.resolve(false);
    }
}

export async function getSecret(username: string): Promise<string | false> {
    if (!keytar) return Promise.resolve<false>(false);
    try {
        const ret = await keytar.getPassword(service, username);
        return ret || Promise.resolve<false>(false);
    } catch (err) {
        console.error('Error getting passphrase with keytar', err);
        return Promise.resolve<false>(false);
    }
}

export async function removeSecret(username: string): Promise<boolean> {
    if (!keytar) return Promise.resolve(false);
    try {
        await keytar.deletePassword(service, username);
        return Promise.resolve(true);
    } catch (err) {
        console.error('Error deleting passphrase with keytar', err);
        return Promise.resolve(false);
    }
}
