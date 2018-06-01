const config = require('~/config');

let Chat = require('~/ui/chat/Chat');
let NewChannel = require('~/ui/chat/NewChannel');
let UserSearchError = require('~/ui/shared-components/UserSearchError');
let SignupLink = require('~/ui/login/SignupLink');
let Copyright = require('~/ui/settings/components/Copyright');
let PoweredByLogin = require('~/ui/login/PoweredBy');
let PoweredBySettings = require('~/ui/login/PoweredBy');
let ZeroChats = require('~/ui/chat/ZeroChats');

// All whitelabels
if (config.whiteLabel.name) {
    Copyright = require('~/ui/settings/components/Copyright_WL');
    PoweredByLogin = require('~/ui/login/PoweredBy_WL');
    PoweredBySettings = require('~/ui/settings/components/PoweredBy_WL');
}

// Medcryptor
if (config.whiteLabel.name === 'medcryptor') {
    Chat = require('~/ui/chat/Chat_medcryptor');
    NewChannel = require('~/ui/chat/NewChannel_medcryptor');
    UserSearchError = require('~/ui/shared-components/UserSearchError_medcryptor');
    SignupLink = require('~/ui/login/SignupLink_medcryptor');
    ZeroChats = require('~/ui/chat/ZeroChats_medcryptor');
}

module.exports = {
    Chat,
    NewChannel,
    UserSearchError,
    SignupLink,
    Copyright,
    PoweredByLogin,
    PoweredBySettings,
    ZeroChats
};
