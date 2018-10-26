const config = require('~/config').default;

let PoweredBySettings = require('~/ui/login/PoweredBy');

if (config.whiteLabel.name) {
    PoweredBySettings = require('~/ui/settings/components/PoweredBy_WL');
}

module.exports = PoweredBySettings;
