const React = require('react');
const config = require('~/config');
const routerStore = require('~/stores/router-store');
const T = require('~/ui/shared-components/T');
const STRINGS = require('./strings');

class ELEMENTS {
    get currentView() {
        return routerStore.ROUTES_INVERSE[routerStore.currentRoute];
    }

    textParser = {
        toCreateDM: text => {
            return (
                <a className="clickable" onClick={() => routerStore.navigateTo(routerStore.ROUTES.newChat)}>
                    {text}
                </a>
            );
        },
        toCreateRoom: text => {
            return (
                <a className="clickable" onClick={() => routerStore.navigateTo(routerStore.ROUTES.newChannel)}>
                    {text}
                </a>
            );
        },
        toCreatePatient: text => {
            return (
                <a className="clickable" onClick={() => routerStore.navigateTo(routerStore.ROUTES.newPatient)}>
                    {text}
                </a>
            );
        }
    };

    get newChannel() {
        const obj = {
            description: [
                <T key="new-channel-description" k={STRINGS.newChannel.description} />,
                <T key="new-channel-offer-dm" k={STRINGS.newChannel.offerDM}>{this.textParser}</T>
            ]
        };

        if (config.whiteLabel.name === 'medcryptor') {
            if (this.currentView === 'newPatient') {
                obj.description = [
                    <T key="new-channel-offer-room" k={STRINGS.newChannel.offerDM}>{this.textParser}</T>
                ];
            }
        }

        return obj;
    }

    get newChat() {
        const obj = {
            description: [
                <T key="new-chat-desc" k="title_newDirectMessageDescription" />,
                <T key="new-chat-offer-room" k={STRINGS.newChat.offerRoom}>{this.textParser}</T>
            ]
        };

        if (config.whiteLabel.name === 'medcryptor') {
            obj.description.splice(1, 0,
                <T key="new-chat-offer-patient" k="mcr_title_offerNewPatient">{this.textParser}</T>
            );
        }

        return obj;
    }
}

module.exports = new ELEMENTS();
