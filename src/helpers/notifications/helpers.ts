import { remote as electron } from 'electron';

const { app, getCurrentWindow } = electron;

export function bringAppToFront() {
    // Put app window into foreground.
    app.focus();
    const win = getCurrentWindow();
    if (win.isMinimized()) {
        win.restore();
    }
    win.show();
}
