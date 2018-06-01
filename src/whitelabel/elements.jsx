const React = require('react');
const config = require('~/config');
const { chatStore } = require('peerio-icebear');
const routerStore = require('~/stores/router-store');
const T = require('~/ui/shared-components/T');
const STRINGS = require('./strings');

class ELEMENTS {
    get space() {
        return chatStore.spaces.find(x => x.spaceId === chatStore.activeSpace);
    }

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
            title: (
                <T k={STRINGS.newChannel.title} tag="span" />
            ),
            description: [
                <T key="new-channel-description" k={STRINGS.newChannel.description} />,
                <T key="new-channel-offer-dm" k={STRINGS.newChannel.offerDM}>{this.textParser}</T>
            ],
            acceptFunction: 'createNewChannel'
        };

        if (config.whiteLabel.name === 'medcryptor') {
            if (this.currentView === 'newPatient') {
                obj.description = (
                    <T k={STRINGS.newChannel.offerDM}>{this.textParser}</T>
                );

                obj.acceptFunction = 'createNewPatientSpace';
            }

            if (this.currentView === 'newInternalRoom') {
                obj.description = (
                    <T k={STRINGS.newChannel.description} />
                );
            }

            if (this.currentView === 'newPatientRoom') {
                obj.title = (
                    <T k={STRINGS.newChannel.title} tag="span">{{ patientName: this.space.spaceName }}</T>
                );
                obj.description = (
                    <T k={STRINGS.newChannel.description} />
                );
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
