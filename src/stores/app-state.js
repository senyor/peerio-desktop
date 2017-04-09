const { observable } = require('mobx');
const electron = require('electron').remote;

class AppState {
    @observable isFocused = false;

    constructor() {
        const win = electron.getCurrentWindow();
        win.on('focus', () => {
            this.isFocused = true;
        });
        win.on('blur', () => {
            this.isFocused = false;
        });
        this.isFocused = win.isFocused();
        window.onunload = () => win.removeAllListeners();
    }
}

module.exports = new AppState();
