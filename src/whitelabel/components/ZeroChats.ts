import config from '~/config';

// eslint-disable-next-line import/no-mutable-exports
let ZeroChats = require('~/ui/chat/components/ZeroChats').default;
if (config.whiteLabel.name === 'medcryptor') {
    ZeroChats = require('~/ui/chat/components/ZeroChats_medcryptor').default;
}

export default ZeroChats;
