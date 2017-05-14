const { observable } = require('mobx');
const electron = require('electron').remote;
const L = require('l.js');

class AppState {
    @observable isFocused = false;

    constructor() {
        const win = electron.getCurrentWindow();
        win.on('focus', () => {
            this.isFocused = true;
            L.info('App got focus');
        });
        win.on('blur', () => {
            this.isFocused = false;
            L.info('App lost focus');
        });
        this.isFocused = win.isFocused();
        window.onunload = () => win.removeAllListeners();
    }
}

module.exports = new AppState();
