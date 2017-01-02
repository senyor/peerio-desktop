const db = require('~/stores/tiny-db');

function saveWindowState(state) {
    db.set('windowState', state);
}

function getSavedWindowState() {
    const defaultState = {
        width: 1024,
        height: 728
    };
    const savedState = db.get('windowState');
    return Object.assign(defaultState, savedState || {});
}

module.exports = { saveWindowState, getSavedWindowState };
