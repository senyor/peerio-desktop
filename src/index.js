const isDevEnv = require('./helpers/is-dev-env');
const ipc = require('electron').ipcRenderer;

if (isDevEnv) {
    // to allow require of development modules in dev environment
    const path = require('path');
    const PATH_APP_NODE_MODULES = path.resolve(path.join('app/node_modules'));
    require('module').globalPaths.push(PATH_APP_NODE_MODULES);
}

document.addEventListener('DOMContentLoaded', () => {
    require.extensions['.css'] = function(m, f) {
        m.exports = require(f.replace('.css', '.json'));
    };

    const React = require('react');
    const { socket, config, setTinyDbEngine, FileStreamAbstract } = require('./icebear');
    const { render } = require('react-dom');
    const { Router, createMemoryHistory } = require('react-router');
    const routes = require('./ui/routes');
    const tinyDb = require('./stores/tiny-db');
    const FileStream = require('./helpers/file-stream');

    setTinyDbEngine({
        getValue: tinyDb.getValueAsync,
        setValue: tinyDb.setValueAsync,
        removeValue: tinyDb.removeAsync
    });

    FileStreamAbstract.FileStream = FileStream;

    config.socketServerUrl = 'wss://hocuspocus.peerio.com';
    socket.start();

    window.router = createMemoryHistory();
    render(React.createElement(Router, { history: window.router, routes }), document.getElementById('root'));

    ipc.on('router', (event, message) => {
        window.router.push(message);
    });
    window.router.push('/dev-tools');
});

