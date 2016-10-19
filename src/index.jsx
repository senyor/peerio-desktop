/* eslint-disable */
window.location.hash = '';
document.addEventListener('DOMContentLoaded', () => {
    require.extensions['.css'] = function (m, f) {
        m.exports = require(f.replace('.css', '.json'));
    };
    const React   = require('react');
    const {autorun} = require('mobx');
    const {t} = require('peerio-translator');
    const {socket, config} = require('./icebear');
    const {render} = require('react-dom');
    const {Router, hashHistory} = require('react-router');
    const {dialog} = require('electron').remote;
    const updater = require('./update');
    const routes  = require('./routes');

    config.socketServerUrl = 'wss://hocuspocus.peerio.com';
    socket.start();

    autorun(() => {
        console.log('autoron', updater)
        if (updater.hasUpdateAvailable === false) return false;
        const updateMessage = `${t('updateAvailable', {releaseName: updater.releaseName})}
                                \n ${t('updateAvailableText', {releaseMessage: updater.releaseMessage})}`;
        alert(updateMessage, updater.installFn);
        return true;
    });

    render(<Router history={hashHistory} routes={routes}/>, document.getElementById('root'));
});
