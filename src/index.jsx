/* eslint-disable */
document.addEventListener('DOMContentLoaded', () => {
    require.extensions['.css'] = function (m, f) {
        m.exports = require(f.replace('.css', '.json'));
    };

    const React = require('react');
    const {socket, config, setTinyDbEngine } = require('./icebear');
    const {render} = require('react-dom');
    const {Router, createMemoryHistory} = require('react-router');
    const routes = require('./routes');
    const tinyDb = require('./stores/tiny-db');
    
    setTinyDbEngine({
        getValue: tinyDb.getValueAsync,
        setValue: tinyDb.setValueAsync,
        removeValue: tinyDb.removeAsync
    });

    config.socketServerUrl = 'wss://hocuspocus.peerio.com';
    socket.start();

    const history = createMemoryHistory();
    render(<Router history={history} routes={routes}/>, document.getElementById('root'));
});

