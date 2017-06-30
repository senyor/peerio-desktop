const { observable } = require('mobx');
const electron = require('electron').remote;

class AppState {
    @observable isFocused = false;
    @observable devModeEnabled = false;

    constructor() {
        const win = electron.getCurrentWindow();
        win.on('focus', () => {
            this.isFocused = true;
            console.log('App got focus');
        });
        win.on('blur', () => {
            this.isFocused = false;
            console.log('App lost focus');
        });
        this.isFocused = win.isFocused();
        window.onunload = () => win.removeAllListeners();
    }
}

module.exports = new AppState();
