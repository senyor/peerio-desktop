const config = require('~/config');
const React = require('react');

function executeWarningAction(name) {
    switch (name) {
        case 'UPGRADE':
            window.open(config.upgradeUrl);
            break;
        default:
            console.error(`Can not find an action for warning action name ${name}`);
    }
}

function renderAnchor(url, text) {
    return React.createElement('a', { href: url }, text);
}

const urlKeyMap = {
    // title_MPIntro1: {
    //     emphasis: renderAnchor.bind(null, config.upgradeUrl)
    // }
};

module.exports = { executeWarningAction, urlKeyMap };
