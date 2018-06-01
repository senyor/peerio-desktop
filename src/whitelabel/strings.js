const config = require('~/config');
const routerStore = require('~/stores/router-store');

const currentView = routerStore.ROUTES_INVERSE[routerStore.currentRoute];

class STRINGS {
    get newChannel() {
        const obj = {
            title: 'title_createChannel',
            description: 'title_createChannelDetails',
            offerDM: 'title_offerNewDM',
            channelName: 'title_channelName',
            channelPurpose: 'title_purpose',
            purposeHelper: 'title_optional',
            userPickerTitle: 'title_chatWith'
        };

        if (config.whiteLabel.name === 'medcryptor') {
            obj.title = 'mcr_title_newRoom';
        }

        return obj;
    }

    get newChat() {
        const obj = {
            offerRoom: 'title_offerNewRoom'
        };

        if (config.whiteLabel.name === 'medcryptor') {
            obj.offerRoom = 'mcr_title_offerNewRoom';
        }

        return obj;
    }
}

module.exports = new STRINGS();
