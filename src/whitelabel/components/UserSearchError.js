const config = require('~/config');

let UserSearchError = require('~/ui/shared-components/UserSearchError').default;

if (config.whiteLabel.name === 'medcryptor') {
    UserSearchError = require('~/ui/shared-components/UserSearchError_medcryptor');
}

module.exports = UserSearchError;
