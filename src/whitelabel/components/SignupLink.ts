import config from '~/config';

// eslint-disable-next-line import/no-mutable-exports
let SignupLink = require('~/ui/login/SignupLink').default;
if (config.whiteLabel.name === 'medcryptor') {
    SignupLink = require('~/ui/login/SignupLink_medcryptor').default;
}

export default SignupLink;
