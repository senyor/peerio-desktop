const config = require('~/config').default;

let PoweredByLogin = require('~/ui/login/PoweredBy');

if (config.whiteLabel.name) {
    PoweredByLogin = require('~/ui/login/PoweredBy_WL');
}

module.exports = PoweredByLogin;
