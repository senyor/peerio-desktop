const { observable, reaction } = require('mobx');
const { TinyDb, Clock, User, warnings, clientApp } = require('~/icebear');
const autologin = require('~/helpers/autologin');
const appControl = require('~/helpers/app-control');

/**
 * This is a global UI state store. File where all things that couldn't find a place yet live.
 * Every time you add something in here - a beautiful kitten dies.
 * Every time you remove something from here - you're getting smarter.
 */
class UIStore {
    @observable contactDialogUsername;

    // current folder selected in Files.jsx
    // used by drop
    @observable currentFolder;

    // Message object to show in sidebar when clicking on receipts
    @observable selectedMessage;

    // show dialog about signature error
    @observable isFileSignatureErrorDialogActive = false;
    hideFileSignatureErrorDialog = () => { this.isFileSignatureErrorDialogActive = false; };
    showFileSignatureErrorDialog = () => { this.isFileSignatureErrorDialogActive = true; };

    // subscribe to this observable and it will change every minute
    minuteClock = new Clock(60);
    // message drafts, not persisted. key: chat id, value: text
    unsentMessages = {};

    // Reference to ProseMirror message input editor.
    messageInputEditorView = null;

    focusMessageInput = () => {
        if (this.messageInputEditorView) {
            this.messageInputEditorView.focus();
        }
    }

    // anything you add here will be stored with 'pref_' prefix in personal tinydb
    @observable prefs = {
        messageSoundsEnabled: true,
        mentionSoundsEnabled: false,
        errorSoundsEnabled: true,
        messageDesktopNotificationsEnabled: true,
        mentionDesktopNotificationsEnabled: false,
        last2FATrustDeviceSetting: false,
        chatSideBarIsOpen: true,
        limitInlineImageSize: true, // will use config.chat.inlineImageSizeLimit
        externalContentConsented: false, // false - no feedback from user yet, true - user expressed their desire
        externalContentEnabled: false,
        externalContentJustForFavs: false,
        peerioContentConsented: false, // false - no feedback from user yet, true - user expressed their desire
        peerioContentEnabled: true
    };

    // anything you add here will be stored with 'pref_' prefix in shared (system) tinydb
    @observable sharedPrefs = {
        prereleaseUpdatesEnabled: false
    }

    // initializes prefs and sharePrefs with stored data and subscribes to changes to persist them
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

    // should be called only once, after user has been authenticated first time
    // currently authenticated app root component calls it on mount
    init() {
        Object.keys(this.prefs).forEach((key) => {
            this.observePreference(key, 'user', this.prefs);
        });
        Object.keys(this.sharedPrefs).forEach((key) => {
            this.observePreference(key, 'system', this.sharedPrefs);
        });

        // clear user data and relaunch when user has been deleted
        reaction(() => User.current.deleted,
            async (deleted) => {
                if (!deleted) return;
                await autologin.disable();
                await User.current.clearFromTinyDb();
                appControl.relaunch();
            });

        // warn user when blacklisted and relaunch
        reaction(() => User.current.blacklisted, (blacklisted) => {
            if (!blacklisted) return;
            warnings.addSevere('error_accountSuspendedText', 'error_accountSuspendedTitle', null,
                async () => {
                    await autologin.disable();
                    await User.current.clearFromTinyDb();
                    appControl.relaunch();
                });
        });
    }
}

const store = new UIStore();
clientApp.uiUserPrefs = store.prefs;

module.exports = store;
