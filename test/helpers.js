const Application = require('spectron').Application;
const chaiAsPromised = require('chai-as-promised');
const config = require('./config');

const isDev = process.env.NODE_ENV !== 'production';

function startApp(context) {
    context.app = isDev
            ? new Application({ path: './node_modules/.bin/electron', args: ['app'] })
            : new Application({ path: `./dist/mac/${config.appName}.app/Contents/MacOS/${config.appName}` });

    return context.app.start().then(() => {
        expect(context.app.isRunning()).to.be.true;
        chaiAsPromised.transferPromiseness = context.app.transferPromiseness;
        return context.app.client.windowByIndex(isDev ? 1 : 0).waitUntilWindowLoaded();
    });
}

function closeApp(context) {
    if (context.app && context.app.isRunning()) {
        return context.app.stop();
    }
    return null;
}

module.exports = { startApp, closeApp, isDev };
