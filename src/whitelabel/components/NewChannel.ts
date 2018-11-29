import config from '~/config';

// eslint-disable-next-line import/no-mutable-exports
let NewChannel = require('~/ui/chat/NewChannel').default;
if (config.whiteLabel.name === 'medcryptor') {
    NewChannel = require('~/ui/chat/NewChannel_medcryptor').default;
}

export default NewChannel;
