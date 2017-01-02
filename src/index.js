const isDevEnv = require('~/helpers/is-dev-env');
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

    // <emojione> ------------------------------------------------------------------------------------------------
    // configuring emojione and preloading sprites
    const emojione = require('~/static/emoji/emojione.js');
    emojione.ascii = true;
    emojione.imagePathPNG = './static/emoji/png/';
    emojione.imagePathSVG = '';
    emojione.imagePathSVGSprites = '';
    emojione.sprites = false;

    let preloadSpritesContainer = document.createElement('span');
    preloadSpritesContainer.className = 'emoji-picker hide';
    preloadSpritesContainer.style.zIndex = '-10000';
    let preloadSprites = document.createElement('span');
    preloadSprites.className = 'emojione emojione-1f602 hide';
    preloadSpritesContainer.appendChild(preloadSprites);
    document.body.appendChild(preloadSpritesContainer);
    setTimeout(() => {
        document.body.removeChild(preloadSpritesContainer);
        preloadSpritesContainer = undefined;
        preloadSprites = undefined;
    }, 2000);
    // </emojione> -----------------------------------------------------------------------------------------------
    const React = require('react');
    const { socket, setTinyDbEngine, FileStreamAbstract } = require('~/icebear');
    const { render } = require('react-dom');
    const { Router, createMemoryHistory } = require('react-router');
    const routes = require('~/ui/routes');
    const tinyDb = require('~/stores/tiny-db');
    const FileStream = require('~/helpers/file-stream');

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

