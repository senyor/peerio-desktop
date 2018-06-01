const React = require('react');
const config = require('~/config');
const routerStore = require('~/stores/router-store');
const T = require('~/ui/shared-components/T');

const currentView = routerStore.ROUTES_INVERSE[routerStore.currentRoute];
const STRINGS = require('./strings');

class ELEMENTS {
    parserCreateRoom = {
        toCreateRoom: text => {
            return (
                <a className="clickable" onClick={() => routerStore.navigateTo(routerStore.ROUTES.newChannel)}>
                    {text}
                </a>
            );
        }
    };

    parserCreatePatient = {
        toCreatePatient: text => {
            return (
                <a className="clickable" onClick={() => routerStore.navigateTo(routerStore.ROUTES.newPatient)}>
                    {text}
                </a>
            );
        }
    };

    get newChatElements() {
        const obj = {
            description: [
                <T key="new-chat-desc" k="title_newDirectMessageDescription" />,
                <T key="new-chat-offer-room" k={STRINGS.newChat.offerRoom}>{this.parserCreateRoom}</T>
            ]
        };

        if (config.whiteLabel.name === 'medcryptor') {
            obj.description.splice(1, 0,
                <T key="new-chat-offer-patient" k="mcr_title_offerNewPatient">{this.parserCreatePatient}</T>
            );
        }

        return obj;
    }
}

module.exports = new ELEMENTS();
