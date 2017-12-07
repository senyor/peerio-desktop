const { User, warnings, crypto, TinyDb } = require('peerio-icebear');
const keychain = require('~/helpers/keychain');

function enable() {
    return _setAutologin(true);
}

function disable() {
    return _setAutologin(false);
}


function _setAutologin(enabled) {
    User.current.autologinEnabled = enabled;
    if (enabled) {
        keychain.saveSecret(User.current.username, crypto.cryptoUtil.padPassphrase(User.current.passphrase))
            .then((ret) => {
                if (!ret) {
                    console.error('Failed to set autologin (libary returned false).');
                    warnings.addSevere('title_autologinSetFail');
                }
                User.current.autologinEnabled = true;
            })
            .catch(() => {
                User.current.autologinEnabled = false;
                warnings.addSevere('title_autologinSetFail');
            });
    } else {
        keychain.removeSecret(User.current.username)
            .then(() => {
                User.current.autologinEnabled = false;
            })
            .catch(() => {
                User.current.autologinEnabled = true;
                warnings.addSevere('title_autologinDisableFail');
            });
    }
}

function getPassphrase(username) {
    return keychain.getSecret(username)
        .then((padded) => {
            if (padded) return crypto.cryptoUtil.unpadPassphrase(padded);
            return false;
        });
}

/**
 * Marks current user on current device as 'should not be suggested to enablie autologin'
 */
function dontSuggestEnablingAgain() {
    return TinyDb.user.setValue('autologinSuggested', true);
}

async function shouldSuggestEnabling() {
    const ret = await TinyDb.user.getValue('autologinSuggested');
    return !ret;
}

module.exports = { enable, disable, getPassphrase, dontSuggestEnablingAgain, shouldSuggestEnabling };
