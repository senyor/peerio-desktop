const config = require('~/config');

const NEW_CHANNEL_STRINGS = {
    title: 'title_createChannel',
    description: 'title_createChannelDetails',
    offerDM: 'title_offerNewDM',
    channelName: 'title_channelName',
    channelPurpose: 'title_purpose',
    purposeHelper: 'title_optional',
    userPickerTitle: 'title_chatWith'
};

const NEW_CHAT_STRINGS = {
    offerRoom: 'title_offerNewRoom'
};
if (config.whiteLabel.name === 'medcryptor') {
    NEW_CHAT_STRINGS.offerRoom = 'mcr_title_offerNewRoom';
}

module.exports = {
    NEW_CHANNEL_STRINGS,
    NEW_CHAT_STRINGS
};
