const config = require('~/config');

module.exports.UserSearchError = config.appLabel === 'medcryptor'
    ? require('~/ui/shared-components/UserSearchError_medcryptor')
    : require('~/ui/shared-components/UserSearchError');
