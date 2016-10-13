const observable = require('mobx').observable;
const os = require('os');

const autoUpdater = require('electron').autoUpdater;
const isDevEnv = process.env.NODE_ENV !== 'production';
const platform = os.platform() + '_' + os.arch();  // usually returns darwin_64

// set update server url from env variable

class Updater {
    @observable hasUpdateAvailable = false;
}


module.exports = function(currentVersion) {
    if (isDevEnv) {

        if (!isDevEnv) {
            // autoUpdater will crash if electron executable is not code-signed (e.g. in development)
            autoUpdater.setFeedURL('https://leviosa.peerio.com/update/' + platform + '/' + version);
            autoUpdater.checkForUpdates();
        }
    } else {

        console.log('https://leviosa.peerio.com/update/'+platform+'/'+version)
    }

    // export Updater
}
