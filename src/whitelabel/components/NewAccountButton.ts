import config from '~/config';

// eslint-disable-next-line import/no-mutable-exports
let NewAccountButton = require('~/ui/login/NewAccountButton').default;
if (config.whiteLabel.name === 'medcryptor') {
    NewAccountButton = require('~/ui/login/NewAccountButton_medcryptor').default;
}

export default NewAccountButton;
