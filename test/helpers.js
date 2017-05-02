/**
 * Helper functions for e2e tests.
 */

const electron = require('electron');
const Application = require('spectron').Application;
const chaiAsPromised = require('chai-as-promised');
const fs = require('fs');

const isDev = process.env.NODE_ENV !== 'production';

/**
 * Starts the electron app and waits for it to load.
 *
 * @returns Promise
 */
function startApp(context) {
    context.app = isDev
            ? new Application({ path: electron, args: ['./app'] })
            : new Application({
                path: `./dist/mac/Peerio.2.app/Contents/MacOS/Peerio.2`
            });

    return context.app.start().then(() => {
        expect(context.app.isRunning()).to.be.true;
        chaiAsPromised.transferPromiseness = context.app.transferPromiseness;
        return context.app.client.windowByIndex(1);
    })
    .then(() => {
        return context.app.client.waitUntilWindowLoaded();
    });
}

/**
 * Loads electron and waits until it's connected to the server.
 *
 * @returns Promise
 */
function startAppAndConnect(context) {
    return startApp(context)
        .then(() => {
            return context.app.client.waitUntil(() => {
                return context.app.client.execute(() => {
                    return ice.socket.connected; // eslint-disable-line no-undef
                })
                .then((c) => { return c.value; });
            }, 5000, 'websocket connection timed out', 500);
        });
}

/**
 * Start the app, wait until socket is connected, and log in with passphrase regardless of
 * whether or not a returning user is set.
 *
 * @returns Promise
 */
function startAppAndLogin(context) {
    return startAppAndConnect(context)
        .then(() => login(context));
}

/**
 * Log in with passphrase.
 *
 * Passcode will be force-wiped because passcodes take too damn long to be practical
 * when tests are running on the CI.
 *
 * Depending on state of test suite/machine, the returning user flag
 * may or may not be set, so we clear it if it was set.
 *
 * @returns Promise
 */
function login(context) {
    return context.app.electron.remote.app.getPath('userData')
        .then((p) => {
            // wipe the passcode
            const systemTinyDb = JSON.parse(fs.readFileSync(`${p}/system_tinydb.json`));
            delete systemTinyDb[`${testUser.username}:passcode`];
            fs.writeFileSync(`${p}/system_tinydb.json`, JSON.stringify(systemTinyDb));
            return context.app.client
                .isVisible('.welcome-back');
        })
        .then((returning) => {
            return returning ? context.app.client.click('.welcome-back') : true;
        })
        .then(() => {
            return context.app.client.setValue('div.login-form > div:nth-child(2) input', testUser.username)
                .setValue('div.login-form > div.password input', testUser.passphrase)
                .waitForEnabled('div.login > button')
                .click('div.login > button');
        })
        .then(() => {
            return context.app.client.waitForVisible('.new-device', 30000);
        })
        .catch((err) => {
            return Promise.reject(err);
        });
}

/**
 * Close the app.
 *
 * @returns Promise
 */
function closeApp(context) {
    if (context.app && context.app.isRunning()) {
        return context.app.stop();
    }
    return null;
}

module.exports = {
    startApp,
    startAppAndConnect,
    startAppAndLogin,
    login,
    closeApp,
    isDev
};
