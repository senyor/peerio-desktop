const config = require('~/config').default;

let Chat = require('~/ui/chat/Chat');

if (config.whiteLabel.name === 'medcryptor') {
    Chat = require('~/ui/chat/Chat_medcryptor');
}

module.exports = Chat;
