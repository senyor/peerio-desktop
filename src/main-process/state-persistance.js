import TinyDb from 'peerio-icebear/dist/db/tiny-db';

export function saveWindowState(state) {
    return TinyDb.system.setValue('windowState', state);
}

export async function getSavedWindowState() {
    const savedState = (await TinyDb.system.getValue('windowState')) || {};

    return {
        x: savedState.x,
        y: savedState.y,
        width: savedState.width || 1024,
        height: savedState.height || 728,
        isMaximized: savedState.isMaximized
    };
}
