const isDevEnv = require('~/helpers/is-dev-env');
if (!isDevEnv) require('~/helpers/console-history');
const { ipcRenderer, webFrame } = require('electron');

// apply desktop config values to icebear
require('~/config');

if (isDevEnv) {
    // to allow require of development modules in dev environment
    const path = require('path');
    const PATH_APP_NODE_MODULES = path.resolve(path.join('app/node_modules'));
    require('module').globalPaths.push(PATH_APP_NODE_MODULES);
    // enable react-perf chrome dev tool
    // window.Perf = require('react-addons-perf');

    // enable shortcuts for recording tests
    // window.recordUI = require('~/helpers/test-recorder').recordUI;
    // window.stopRecording = require('~/helpers/test-recorder').stopRecording;
}

// configure logging
require('../build/helpers/logging');

// debug aid global vars
window.ice = require('~/icebear');
// shortcut to use with promises
window.clog = console.log.bind(console);
window.cerr = console.error.bind(console);
// !!!! DEBUG. !!!!!!!!!!!!!!!!!!!!!!!!!
window.spamCounter = 0;
window.spam = function(interval = 1000, words = 10) {
    if (window.spamInterval) return;
    const ice = require('~/icebear');
    window.spamInterval = setInterval(() => {
        if (!ice.chatStore.activeChat) return;
        ice.chatStore.activeChat.sendMessage(
            `${window.spamCounter++} ${ice.PhraseDictionary.current.getPassphrase(words)}`);
    }, interval);
};

window.stopSpam = function() {
    if (!window.spamInterval) return;
    clearInterval(window.spamInterval);
    window.spamInterval = null;
};

document.addEventListener('DOMContentLoaded', () => {
    // <emojione> ------------------------------------------------------------------------------------------------
    // configuring emojione and preloading sprites
    const emojione = require('~/static/emoji/emojione.js');
    emojione.ascii = true;
    emojione.imagePathPNG = './static/emoji/png/';
    emojione.sprites = false;
    emojione.greedyMatch = true;

    // let preloadSpritesContainer = document.createElement('span');
    // preloadSpritesContainer.className = 'emoji-picker hide';
    // preloadSpritesContainer.style.zIndex = '10000';
    // let preloadSprites = document.createElement('span');
    // preloadSprites.className = 'emojione emojione-32-diversity _1f469-1f3fb-1f692 hide';
    // preloadSpritesContainer.appendChild(preloadSprites);
    // document.body.appendChild(preloadSpritesContainer);
    // setTimeout(() => {
    //     document.body.removeChild(preloadSpritesContainer);
    //     preloadSpritesContainer = undefined;
    //     preloadSprites = undefined;
    // }, 2000);
    // </emojione> -----------------------------------------------------------------------------------------------
    const React = require('react');
    const { socket } = require('~/icebear');
    const { render } = require('react-dom');
    const { Router, createMemoryHistory } = require('react-router');
    window.router = createMemoryHistory();
    const routes = require('~/ui/routes');

    socket.start();

    render(React.createElement(Router, { history: window.router, routes }), document.getElementById('root'));

    ipcRenderer.on('router', (event, message) => {
        window.router.push(message);
    });
});

// Disable zoom.
webFrame.setVisualZoomLevelLimits(1, 1);
webFrame.setLayoutZoomLevelLimits(0, 0);
