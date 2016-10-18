const { observable } = require('mobx');
const os = require('os');
const { autoUpdater, app } = require('electron');

const isDevEnv = process.env.NODE_ENV !== 'production';
const platform = `${os.platform()}_${os.arch()}`;  // usually returns darwin_64

/**
 * Handles the electron autoUpdater API and exposes three observables:
 * - hasUpdateAvailable (Boolean)
 * - updating (Boolean)
 * - errors (Array)
 */
class Updater {
    @observable updating: boolean = false;
    @observable hasUpdateAvailable: boolean = false;
    @observable errors: array = [];

    /**
     * Set name and description for a new release.
     *
     * @param {String} releaseName --semver
     * @param {String} releaseMessage
     */
    setRelease(releaseName, releaseMessage) {
        this.releaseName = releaseName;
        this.releaseMessage = releaseMessage;
        this.hasUpdateAvailable = true;
        this.updating = false;
    }

    /**
     * Set an installer function.
     *
     * @param {Function} value
     * @return {void}
     */
    set installFn(value) {
        this._installFn = value;
    }

    /**
     * Get the installer function.
     *
     * @returns {Function}
     */
    get installFn() {
        return this._installFn;
    }
}

const updater = new Updater();
const currentVersion = app.getVersion();

app.on('ready', onAppReady);

function onAppReady() {
    if (!isDevEnv) {
        autoUpdater.setFeedURL(`https://leviosa.peerio.com/update/${platform}/${currentVersion}`);
        autoUpdater.checkForUpdates();
        updater.installFn = function installFn() {
            autoUpdater.quitAndInstall();
        };

        autoUpdater
            .addListener('checking-for-update', () => {
                updater.updating = true;
            })
            .addListener('update-available', () => {
                updater.updating = true;
            })
            .addListener('update-not-available', () => {
                updater.updating = false;
            })
            .addListener('error', (err) => {
                updater.updating = false;
                updater.errors.push(err);
            })
            .addListener('update-downloaded', (event, releaseNotes, releaseName) => {
                updater.setRelease(releaseName, releaseNotes);
            });
    } else {
        // autoUpdater will crash if electron executable is not code-signed (e.g. in development)
        console.log('Simulating autoUpdate in dev mode.');
        console.log(`https://leviosa.peerio.com/update/${platform}/${currentVersion}`);
        updater.installFn = function installFn() {
            console.log('Called the install function.');
        };
        setTimeout(() => {
            console.log('Setting update to available.');
            updater.setRelease('0.0.0', 'bogus update');
        }, 5000);
    }
}

module.exports = updater;
