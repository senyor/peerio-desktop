const config = require('~/config');
// const React = require('react');

function executeWarningAction(name) {
    switch (name) {
        case 'UPGRADE':
            window.open(config.upgradeUrl);
            break;
        default:
            console.error(`Can not find an action for warning action name ${name}`);
    }
}

module.exports = { executeWarningAction };
