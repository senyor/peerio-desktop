// global UI store
const { observable, reaction } = require('mobx');
const { TinyDb, Clock, User, warnings, clientApp } = require('~/icebear');
const autologin = require('~/helpers/autologin');
const appControl = require('~/helpers/app-control');

class UIStore {
    @observable contactDialogUsername;

    // show dialog about signature error
    @observable isFileSignatureErrorDialogActive = false;

    hideFileSignatureErrorDialog = () => { this.isFileSignatureErrorDialogActive = false; };
    showFileSignatureErrorDialog = () => { this.isFileSignatureErrorDialogActive = true; };

    minuteClock = new Clock(60);

    // stored with 'pref_' prefix in tinydb
    @observable prefs = {
        messageSoundsEnabled: true,
        mentionSoundsEnabled: false,
        errorSoundsEnabled: true,
        messageDesktopNotificationsEnabled: true,
        mentionDesktopNotificationsEnabled: false,
        last2FATrustDeviceSetting: false,
        chatSideBarIsOpen: true,
        limitInlineImageSize: false, // will use config.chat.inlineImageSizeLimit
        externalContentConsented: false, // false - no feedback from user yet, true - user expressed their desire
        externalContentEnabled: false,
        externalContentJustForFavs: false,
        peerioContentConsented: false, // false - no feedback from user yet, true - user expressed their desire
        peerioContentEnabled: true
    };

    @observable sharedPrefs = {
        prereleaseUpdatesEnabled: false
    }

    // key: chat id, value: text
    unsentMessages = {};

    observePreference(key, dbName, localStore) {
        const prefKey = `pref_${key}`;
        TinyDb[dbName].getValue(prefKey)
            .then((loadedValue) => {
                if (loadedValue || loadedValue === false) {
                    localStore[key] = loadedValue;
                }
                reaction(() => localStore[key], () => {
                    TinyDb[dbName].setValue(prefKey, localStore[key]);
                });
            });
    }

    init() {
        Object.keys(this.prefs).forEach((key) => {
            this.observePreference(key, 'user', this.prefs);
        });
        Object.keys(this.sharedPrefs).forEach((key) => {
            this.observePreference(key, 'system', this.sharedPrefs);
        });

        reaction(() => User.current.deleted, async (deleted) => {
            if (deleted) {
                await autologin.disable();
                await User.current.clearFromTinyDb();
                appControl.relaunch();
            }
        });

        reaction(() => User.current.blacklisted, (blacklisted) => {
            if (blacklisted) {
                warnings.addSevere('error_accountSuspendedText', 'error_accountSuspendedTitle', null, async () => {
                    await autologin.disable();
                    await User.current.clearFromTinyDb();
                    appControl.relaunch();
                });
            }
        });
    }
}

const store = new UIStore();
clientApp.uiUserPrefs = store.prefs;

module.exports = store;
