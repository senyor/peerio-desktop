const config = require('~/config');

module.exports.UserSearchError = config.appLabel === 'medcryptor'
    ? require('~/ui/shared-components/UserSearchError_medcryptor')
    : require('~/ui/shared-components/UserSearchError');

module.exports.SignupLink = config.appLabel === 'medcryptor'
    ? require('~/ui/login/SignupLink_medcryptor.jsx')
    : require('~/ui/login/SignupLink.jsx');
