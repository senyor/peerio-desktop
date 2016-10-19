/* eslint-disable */
window.location.hash = '';
document.addEventListener('DOMContentLoaded', () => {
    require.extensions['.css'] = function (m, f) {
        m.exports = require(f.replace('.css', '.json'));
    };
    const React   = require('react');
    const {socket, config} = require('./icebear');
    const {render} = require('react-dom');
    const {Router, hashHistory} = require('react-router');
    const routes  = require('./routes');

    config.socketServerUrl = 'wss://hocuspocus.peerio.com';
    socket.start();

    render(<Router history={hashHistory} routes={routes}/>, document.getElementById('root'));
});

