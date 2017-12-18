const React = require('react');
const { computed, when } = require('mobx');
const { observer } = require('mobx-react');
const { chatStore, chatInviteStore } = require('peerio-icebear');
const routerStore = require('~/stores/router-store');
const { Button } = require('~/react-toolbox');
const T = require('~/ui/shared-components/T');
const css = require('classnames');

@observer
class ZeroChats extends React.Component {
    @computed get invitesReceived() {
        return chatInviteStore.received.length > 0;
    }

    componentDidMount() {
        this.disposer = when(
            () => !!chatStore.chats.length,
            () => {
                routerStore.navigateTo(routerStore.ROUTES.chats);
                this.disposer = null;
            }
        );
    }

    componentWillUnmount() {
        if (this.disposer) this.disposer();
    }

    goToAddChat() {
        routerStore.navigateTo(routerStore.ROUTES.newChat);
    }

    goToAddChannel() {
        routerStore.navigateTo(routerStore.ROUTES.newChannel);
    }

    goToChannelInvite() {
        routerStore.navigateTo(routerStore.ROUTES.channelInvites);
    }

    render() {
        return (
            <div className={css('zero-chats-container', { 'invite-received': this.invitesReceived })}>
                <div className="zero-chats-content">
                    <div className="header">
                        <T k="title_zeroChat" tag="div" className="welcome-title" />
                        <T k="title_zeroChatSubtitle" tag="div" className="subtitle" />
                    </div>

                    <div className="instructions-container">
                        <div className="instructions create-rooms">
                            <div className="text">
                                <div className="text-header">
                                    <div className="chat-item-add" onClick={this.goToAddChannel} >
                                        <div className="chat-item-add-icon" />
                                        <T k="button_createRooms" className="chat-item-title" />
                                    </div>
                                </div>
                                <div className="text-description">
                                    <T k="title_roomsDescription1" tag="div" className="description-large" />
                                    <T k="title_roomsDescription2" tag="div" className="description-small" />
                                    <T k="title_roomsDescription3" tag="div" className="description-small" />
                                    { this.invitesReceived &&
                                        <div className="already-invited">
                                            <T k="title_alreadyInvited" tag="div" className="already-invited-text" />
                                            <Button className="room-invites-button button-affirmative"
                                                onClick={this.goToChannelInvite}>
                                                <T k="title_viewChannelInvites" />
                                            </Button>
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className="image">
                                <img src="./static/img/zero-state-rooms.png" />
                                <img src="./static/img/zero-state-bg-rooms.png" className="background" />
                            </div>
                        </div>

                        <div className="instructions create-dms">
                            <div className="image">
                                <img src="./static/img/zero-state-dms.png" />
                                <img src="./static/img/zero-state-bg-dms.png" className="background" />
                            </div>
                            <div className="text">
                                <div className="text-header">
                                    <div className="chat-item-add" onClick={this.goToAddChat} >
                                        <div className="chat-item-add-icon" />
                                        <T k="button_createDMs" className="chat-item-title" />
                                    </div>
                                </div>
                                <div className="text-description">
                                    <T k="title_dmDescription1" tag="div" className="description-large" />
                                    <T k="title_dmDescription2" tag="div" className="description-small" />
                                    <T k="title_dmDescription3" tag="div" className="description-small" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

module.exports = ZeroChats;
