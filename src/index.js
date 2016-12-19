const isDevEnv = require('./helpers/is-dev-env');
const ipc = require('electron').ipcRenderer;

if (isDevEnv) {
    // to allow require of development modules in dev environment
    const path = require('path');
    const PATH_APP_NODE_MODULES = path.resolve(path.join('app/node_modules'));
    require('module').globalPaths.push(PATH_APP_NODE_MODULES);
    window.Perf = require('react-addons-perf');
}
document.addEventListener('DOMContentLoaded', () => {
    require.extensions['.css'] = function(m, f) {
        m.exports = require(f.replace('.css', '.json'));
    };

    // configuring emojione and preloading sprites
    const emojione = require('emojione');
    emojione.ascii = true;
    emojione.imagePathPNG = '';
    emojione.imagePathSVG = '';
    emojione.imagePathSVGSprites = '';
    emojione.sprites = true;

    let preloadSprites = document.createElement('span');
    preloadSprites.className = 'emojione emojione-1f602 hide';
    document.body.appendChild(preloadSprites);
    setTimeout(() => {
        document.body.removeChild(preloadSprites);
        preloadSprites = undefined;
    }, 2000);

    const React = require('react');
    const { socket, setTinyDbEngine, FileStreamAbstract } = require('./icebear');
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

    socket.start();

    window.router = createMemoryHistory();
    render(React.createElement(Router, { history: window.router, routes }), document.getElementById('root'));

    ipc.on('router', (event, message) => {
        window.router.push(message);
    });
  //  window.router.push('/dev-tools');
});

