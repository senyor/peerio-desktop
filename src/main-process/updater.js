const {app, BrowserWindow, Menu, protocol, ipcMain} = require('electron');
const { autoUpdater } = require('electron-updater');
const os = require('os');
const isDevEnv = require('~/helpers/is-dev-env');
const log = require('electron-log');

const platform = `${os.platform()}_${os.arch()}`;  // usually returns darwin_64

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';

function sendStatusToWindow(text) {
  log.info(text);
  win.webContents.send('updater', text);
}


    _updateUrl = `${config.updateUrl}/${platform}/${config.appVersion}`;

    /**
     * Set the release name.
     *
     * @param {String} releaseName
     * @private
     */
    _setRelease(releaseName) {
        this.releaseName = releaseName;
        this.state = this.states.READY_TO_INSTALL;
    }

    /**
     * Starts auto-update process, supposed to be called once at app start.
     * Safe to call multiple times(ignores 2nd+ calls).
     */
    startUpdateMonitoring = () => {
        if (isDevEnv) {
            // autoUpdater will crash if electron executable is not code-signed (e.g. in development)
            console.log('startUpdateMonitoring: Updates are not available in development environment.');
            // this._setRelease('mock');
            return;
        }
        if (this.state !== this.states.IDLE) return;
        this.state = this.states.MONITORING;
        autoUpdater.setFeedURL(this._updateUrl);
        autoUpdater
            // .addListener('checking-for-update', () => {})
            .addListener('update-available', () => {
                this.state = this.states.DOWNLOADING;
            })
            .addListener('update-not-available', () => {
                this.state = this.states.MONITORING;
            })
            .addListener('error', (err) => {
                console.error('Updater error:', err);
                this.state = this.states.ERROR;
                this.error = normalize(err);
            })
            .addListener('update-downloaded', (event, releaseNotes, releaseName) => {
                this._setRelease(releaseName);
            });

        autoUpdater.checkForUpdates();
    };

    /**
     * Installs updated and downloaded app version.
     */
    quitAndInstall = () => {
        if (this.state !== this.states.READY_TO_INSTALL) {
            console.error('Updater.install() called when updater state is not READY_TO_INSTALL. State:', this.state);
            return;
        }
        autoUpdater.quitAndInstall();
    }


module.exports = {};