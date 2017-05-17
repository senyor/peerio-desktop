// global UI store
const { observable, reaction } = require('mobx');
const { TinyDb, Clock } = require('~/icebear');

class UIStore {
    @observable contactDialogUsername;
    @observable soundsEnabled = true;
    minuteClock = new Clock(60);

    // key: chat id, value: text
    unsentMessages = {};

    async init() {
        this.soundsEnabled = !!await TinyDb.user.getValue('pref_soundsEnabled');
        reaction(() => this.soundsEnabled, () => {
            TinyDb.user.setValue('pref_soundsEnabled', this.soundsEnabled);
        });
    }
}

module.exports = new UIStore();
