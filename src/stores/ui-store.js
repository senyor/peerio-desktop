// global UI store
const { observable, reaction } = require('mobx');
const { TinyDb, Clock, User, warnings } = require('~/icebear');
const autologin = require('~/helpers/autologin');
const appControl = require('~/helpers/app-control');

class UIStore {
    @observable contactDialogUsername;
    minuteClock = new Clock(60);

    // stored with 'pref_' prefix in tinydb
    @observable prefs = {
        messageSoundsEnabled: true,
        mentionSoundsEnabled: false,
        errorSoundsEnabled: true,
        messageDesktopNotificationsEnabled: true,
        mentionDesktopNotificationsEnabled: false
    };

    // key: chat id, value: text
    unsentMessages = {};

    init() {
        Object.keys(this.prefs).forEach((key) => {
            const prefKey = `pref_${key}`;
            TinyDb.user.getValue(prefKey)
                .then((loadedValue) => {
                    if (loadedValue || loadedValue === false) {
                        this.prefs[key] = loadedValue;
                    }
                    reaction(() => this.prefs[key], () => {
                        TinyDb.user.setValue(prefKey, this.prefs[key]);
                    });
                });
        });

        reaction(() => User.current.deleted, async (deleted) => {
            if (deleted) {
                await autologin.disable();
                await User.current.clearFromTinyDb();
                appControl.relaunch();
            }
        });

        reaction(() => User.current.blacklisted, async (blacklisted) => {
            if (blacklisted) {
                warnings.addSevere('error_accountSuspended');
                await autologin.disable();
                await User.current.clearFromTinyDb();
                setTimeout(() => appControl.relaunch(), 3000);
            }
        });
    }
}

module.exports = new UIStore();
