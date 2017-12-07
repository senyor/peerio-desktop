// all kinds of network connection improvement things specific to desktop
const appState = require('../stores/app-state');
const { reaction } = require('mobx');
const { socket } = require('peerio-icebear');

let disposer;
// Websocket fails to properly detect connection loss and this causes noticeable lags
// when user experiences a brief disconnection or network switch.
// Sometimes websocket connection won't break even if you disable and then enable wifi in a few seconds.
// It will keep same connection but the actual data in it will start flowing with a big lag of 20-40 seconds.
// So we decide to forcibly close the connection when chromium reports offline event, and then reopen it when
// online event is fired.
function start() {
    if (disposer) return;
    disposer = reaction(() => appState.isOnline, isOnline => {
        if (isOnline) {
            socket.open();
        } else {
            socket.close();
        }
    });
}

function stop() {
    if (disposer) disposer();
    disposer = null;
}


module.exports = { start, stop };
