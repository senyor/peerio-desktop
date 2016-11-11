const { app } = require('electron');
/**
 * Almost completely stock squirrel installer code. Runs the installer and seamlessly installs the app.
 * @returns {boolean} true if squirrel update is a go
 */
function handleSquirrelEvent() {
    // TODO: no OS check?
    if (process.platform !== 'win32' || process.argv.length === 1) {
        return false;
    }

    const ChildProcess = require('child_process');
    const path = require('path');
    const appFolder = path.resolve(process.execPath, '..');
    const rootAtomFolder = path.resolve(appFolder, '..');
    const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
    const exeName = path.basename(process.execPath);

    const spawn = function(command, args) {
        let spawnedProcess;

        try {
            spawnedProcess = ChildProcess.spawn(command, args, { detached: true });
        } catch (err) {
            console.error(err);
        }

        return spawnedProcess;
    };

    const spawnUpdate = function(args) {
        return spawn(updateDotExe, args);
    };

    const squirrelEvent = process.argv[1];
    switch (squirrelEvent) {
        case '--squirrel-firstrun':
            // todo: whatever we might need to do on first run on windows app
            return false;
        case '--squirrel-install':
        case '--squirrel-updated':
            spawnUpdate(['--createShortcut', exeName]);
            setTimeout(app.quit, 1000);
            return true;
        case '--squirrel-uninstall':
            spawnUpdate(['--removeShortcut', exeName]);
            setTimeout(app.quit, 1000);
            return true;
        case '--squirrel-obsolete':
            app.quit();
            return true;
        default:
            return false;
    }
}

module.exports = handleSquirrelEvent();
