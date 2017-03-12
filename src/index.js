const isDevEnv = require('~/helpers/is-dev-env');
const ipc = require('electron').ipcRenderer;
const config = require('~/config');

if (isDevEnv) {
    // to allow require of development modules in dev environment
    const path = require('path');
    const PATH_APP_NODE_MODULES = path.resolve(path.join('app/node_modules'));
    require('module').globalPaths.push(PATH_APP_NODE_MODULES);
    // enable react-perf chrome dev tool
    window.Perf = require('react-addons-perf');
    // debug aid global vars
    window.ice = require('~/icebear');
    // shortcut to use with promises
    window.clog = console.log.bind(console);
}

document.addEventListener('DOMContentLoaded', () => {
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
    const { socket } = require('~/icebear');
    const { render } = require('react-dom');
    const { Router, createMemoryHistory } = require('react-router');
    const routes = require('~/ui/routes');

    socket.start();

    window.router = createMemoryHistory();
    render(React.createElement(Router, { history: window.router, routes }), document.getElementById('root'));

    ipc.on('router', (event, message) => {
        window.router.push(message);
    });
  //  window.router.push('/dev-tools');
});

