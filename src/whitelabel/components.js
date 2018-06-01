const config = require('~/config');

let Copyright = require('~/ui/settings/components/Copyright');
let PoweredByLogin = require('~/ui/login/PoweredBy');
let PoweredBySettings = require('~/ui/login/PoweredBy');

// All whitelabels
if (config.whiteLabel.name) {
    Copyright = require('~/ui/settings/components/Copyright_WL');
    PoweredByLogin = require('~/ui/login/PoweredBy_WL');
    PoweredBySettings = require('~/ui/settings/components/PoweredBy_WL');
}

module.exports = {
    Copyright,
    PoweredByLogin,
    PoweredBySettings
};
