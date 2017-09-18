const React = require('react');
const { observer } = require('mobx-react');
const { Button, List, ListSubHeader, ListItem, TooltipIconButton, FontIcon } = require('~/react-toolbox');
const ChatList = require('./components/ChatList');
const ChatSideBar = require('./components/ChatSideBar');
const { t } = require('peerio-translator');
const { chatInviteStore, clientApp, chatStore, User } = require('~/icebear');
const config = require('../../config');
const ChannelUpgradeOffer = require('./components/ChannelUpgradeOffer');
const ChannelUpgradeDialog = require('./components/ChannelUpgradeDialog');
const moment = require('moment');
const { getAttributeInParentChain } = require('~/helpers/dom');
const routerStore = require('~/stores/router-store');
const T = require('~/ui/shared-components/T');

@observer
class ChannelInvites extends React.Component {
    componentWillMount() {
        clientApp.isInChatsView = false;
        chatStore.deactivateCurrentChat();
    }

    inviteOptions(kegDbId) {
        return (<div data-kegDbId={kegDbId}>
            <Button label={t('button_accept')}
                onClick={this.acceptInvite}
                flat primary disabled={this.isLimitReached} />
            <Button label={t('button_decline')}
                onClick={this.rejectInvite}
                flat />
            {this.isLimitReached
                ? <TooltipIconButton icon="info_outline" tooltip={t('button_channelLimit')}
                    onClick={this.toggleDialog} />
                : null}
        </div>
        );
    }

    gotoChats() {
        routerStore.navigateTo(routerStore.ROUTES.chats);
        clientApp.isInChatsView = true;
    }

    acceptInvite = (ev) => {
        const id = getAttributeInParentChain(ev.target, 'data-kegDbId');
        chatInviteStore.acceptInvite(id).then(this.gotoChats);
    }

    rejectInvite = (ev) => {
        const id = getAttributeInParentChain(ev.target, 'data-kegDbId');
        chatInviteStore.rejectInvite(id);
        if (chatInviteStore.received.length === 0 ||
            (chatInviteStore.received.length === 1 && chatInviteStore.received[0].kegDbId === id)) {
            this.gotoChats();
        }
    }

    get isLimitReached() {
        return User.current.channelsLeft === 0;
    }

    render() {
        return (
            <div className="messages channel-invites">
                <ChatList />
                <div className="message-view">
                    <div className="message-toolbar">
                        <div className="title-container">
                            <div className="title" onClick={this.showChatNameEditor}>
                                <T k="title_channelInvites" />
                            </div>
                            {/* here for layout */}
                            <div className="meta-nav" />
                        </div>
                    </div>
                    <div className="room-invites-container">
                        <div className="inner">
                            <div className="room-invites-list">
                                <ChannelUpgradeOffer />
                                <List selectable>
                                    <ListSubHeader caption="Pending invites" />
                                    {chatInviteStore.received.map(i =>
                                        (<ListItem
                                            key={`${i.kegDbId}${i.username}${i.timestamp}`}
                                            caption={t('title_invitedBy', { username: i.username, timestamp: moment(i.timestamp).format('llll') })}
                                            legend={i.channelName}
                                            rightIcon={this.inviteOptions(i.kegDbId)}
                                        />)
                                    )}
                                </List>
                            </div>
                        </div>
                        <ChatSideBar open="true" />
                    </div>
                </div>
                <ChannelUpgradeDialog />
            </div>
        );
    }
}

module.exports = ChannelInvites;
