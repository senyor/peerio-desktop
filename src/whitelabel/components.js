const config = require('~/config');

let UserSearchError = require('~/ui/shared-components/UserSearchError');
let SignupLink = require('~/ui/login/SignupLink.jsx');
let Copyright = require('~/ui/settings/components/Copyright.jsx');

// All whitelabels
if (config.whiteLabel.name) {
    Copyright = require('~/ui/settings/components/Copyright_WL.jsx');
}

// Medcryptor
if (config.appLabel === 'medcryptor') {
    UserSearchError = require('~/ui/shared-components/UserSearchError_medcryptor');
    SignupLink = require('~/ui/login/SignupLink_medcryptor.jsx');
}

module.exports = {
    UserSearchError,
    SignupLink,
    Copyright
};
