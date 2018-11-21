import config from '~/config';

// eslint-disable-next-line import/no-mutable-exports
let Chat = require('~/ui/chat/Chat').default;
if (config.whiteLabel.name === 'medcryptor') {
    Chat = require('~/ui/chat/Chat_medcryptor').default;
}

export default Chat;
