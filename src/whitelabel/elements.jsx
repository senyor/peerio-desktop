const React = require('react');
const config = require('~/config');
const routerStore = require('~/stores/router-store');
const T = require('~/ui/shared-components/T');

const { NEW_CHAT_STRINGS } = require('./strings');

const parserCreateRoom = {
    toCreateRoom: text => {
        return (
            <a className="clickable" onClick={() => routerStore.navigateTo(routerStore.ROUTES.newChannel)}>{text}</a>
        );
    }
};

const parserCreatePatient = {
    toCreatePatient: text => {
        return (
            <a className="clickable" onClick={() => routerStore.navigateTo(routerStore.ROUTES.newPatient)}>{text}</a>
        );
    }
};

const newChatElements = {
    description: [
        <T key="new-chat-desc" k="title_newDirectMessageDescription" />,
        <T key="new-chat-offer-room" k={NEW_CHAT_STRINGS.offerRoom}>{parserCreateRoom}</T>
    ]
};
if (config.whiteLabel.name === 'medcryptor') {
    newChatElements.description.splice(1, 0,
        <T key="new-chat-offer-patient" k="mcr_title_offerNewPatient">{parserCreatePatient}</T>
    );
}


module.exports = {
    newChatElements
};
