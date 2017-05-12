// global UI store
const { observable, reaction } = require('mobx');
const { TinyDb } = require('~/icebear');

class UIStore {
    @observable contactDialogUsername;
    @observable soundsEnabled = true;
    // key: chat id, value: text
    unsentMessages = {};
    legacyMigrationCredentials = null;

    async init() {
        this.soundsEnabled = !!await TinyDb.user.getValue('pref_soundsEnabled');
        reaction(() => this.soundsEnabled, () => {
            TinyDb.user.setValue('pref_soundsEnabled', this.soundsEnabled);
        });
    }
}

module.exports = new UIStore();
