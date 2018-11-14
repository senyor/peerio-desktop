import config from '~/config';

// eslint-disable-next-line import/no-mutable-exports
let UserSearchError = require('~/ui/shared-components/UserSearchError').default;
if (config.whiteLabel.name === 'medcryptor') {
    UserSearchError = require('~/ui/shared-components/UserSearchError_medcryptor').default;
}

export default UserSearchError;
