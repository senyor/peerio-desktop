const { TinyDb } = require('~/icebear');

function saveWindowState(state) {
    TinyDb.system.setValue('windowState', state);
}

function getSavedWindowState() {
    const defaultState = {
        width: 1024,
        height: 728
    };
    return TinyDb.system.getValue('windowState')
        .then(savedState => Object.assign(defaultState, savedState || {}));
}

module.exports = { saveWindowState, getSavedWindowState };
