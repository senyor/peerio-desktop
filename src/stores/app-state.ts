import { observable, computed, action } from 'mobx';
import { remote as electron } from 'electron';

class AppState {
    @observable isFocused = false;
    @observable isIdle = false;
    @observable devModeEnabled = false;
    // network status as reported by chromium
    @observable isOnline = navigator.onLine;

    @computed
    get isActive() {
        return this.isFocused && !this.isIdle;
    }

    @action.bound
    changeOnlineStatus() {
        console.log(`Chromium reports state change to: ${navigator.onLine ? 'ONLINE' : 'OFFLINE'}`);
        this.isOnline = navigator.onLine;
    }

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

        // prevents some noise in the logs on app shutdown
        window.onunload = () => win.removeAllListeners();

        window.addEventListener('online', this.changeOnlineStatus, false);
        window.addEventListener('offline', this.changeOnlineStatus, false);
    }
}

export default new AppState();
