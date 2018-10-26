const config = require('~/config').default;

let ChatHeader = require('~/ui/chat/components/ChatHeader').default;

if (config.whiteLabel.name === 'medcryptor') {
    ChatHeader = require('~/ui/chat/components/ChatHeader_medcryptor');
}

module.exports = ChatHeader;
