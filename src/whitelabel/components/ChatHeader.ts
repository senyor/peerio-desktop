import config from '~/config';

// eslint-disable-next-line import/no-mutable-exports
let ChatHeader = require('~/ui/chat/components/ChatHeader').default;
if (config.whiteLabel.name === 'medcryptor') {
    ChatHeader = require('~/ui/chat/components/ChatHeader_medcryptor').default;
}

export default ChatHeader;
