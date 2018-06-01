const config = require('~/config');

let SignupLink = require('~/ui/login/SignupLink');
let Copyright = require('~/ui/settings/components/Copyright');
let PoweredByLogin = require('~/ui/login/PoweredBy');
let PoweredBySettings = require('~/ui/login/PoweredBy');

// All whitelabels
if (config.whiteLabel.name) {
    Copyright = require('~/ui/settings/components/Copyright_WL');
    PoweredByLogin = require('~/ui/login/PoweredBy_WL');
    PoweredBySettings = require('~/ui/settings/components/PoweredBy_WL');
}

// Medcryptor
if (config.whiteLabel.name === 'medcryptor') {
    SignupLink = require('~/ui/login/SignupLink_medcryptor');
}

module.exports = {
    SignupLink,
    Copyright,
    PoweredByLogin,
    PoweredBySettings
};
