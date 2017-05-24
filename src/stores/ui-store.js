// global UI store
const { observable, reaction } = require('mobx');
const { TinyDb, Clock } = require('~/icebear');

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
        console.log('here', this.prefs);
        Object.keys(this.prefs).forEach((key) => {
            console.log('loading', key);

            const prefKey = `pref_${key}`;
            TinyDb.user.getValue(prefKey)
            .then((loadedValue) => {
                this.prefs[key] = !!loadedValue;
                reaction(() => this.prefs[key], () => {
                    TinyDb.user.setValue(prefKey, this.prefs[key]);
                });
            });
        });
    }
}

module.exports = new UIStore();
