const React = require('react');
const { observable } = require('mobx');
const { observer } = require('mobx-react');
const { Button, Dialog, Link, List, ListSubHeader, ListItem, TooltipIconButton } = require('~/react-toolbox');
const ChatList = require('./components/ChatList');
const ChatSideBar = require('./components/ChatSideBar');
const { t } = require('peerio-translator');
const { chatInviteStore, clientApp, chatStore, User } = require('~/icebear');
const config = require('../../config');
const ChannelUpgradeOffer = require('./components/ChannelUpgradeOffer');
const ChannelUpgradeDialog = require('./components/ChannelUpgradeDialog');
const moment = require('moment');
const { getAttributeInParentChain } = require('~/helpers/dom');

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
                flat primary />
            <Button label={t('button_decline')}
                onClick={this.rejectInvite}
                flat />
        </div>
        );
    }

    acceptInvite = (ev) => {
        const id = getAttributeInParentChain(ev.target, 'data-kegDbId');
        chatInviteStore.acceptInvite(id);
    }

    rejectInvite = (ev) => {
        const id = getAttributeInParentChain(ev.target, 'data-kegDbId');
        chatInviteStore.rejectInvite(id);
    }

    render() {
        const limitReached = false;

        return (
            <div className="messages">
                <ChatList />
                <div className="message-view">
                    <div className="message-toolbar flex-justify-between">
                        <div className="flex-col">
                            <div className="title" onClick={this.showChatNameEditor}>
                                Channel invites
                            </div>
                            {/* here for layout */}
                            <div className="flex-row meta-nav" />
                        </div>
                    </div>
                    <div className="flex-row flex-grow-1">
                        <div className="flex-col flex-grow-1" style={{ position: 'relative' }}>
                            <div className="channel-invites-list">
                                <ChannelUpgradeOffer />
                                <List selectable>
                                    <ListSubHeader caption="Pending invites" />
                                    {chatInviteStore.received.map(i =>
                                        (<ListItem
                                            key={`${i.kegDbId}${i.username}${i.timestamp}`}
                                            caption={t('title_invitedBy', { username: i.username, timestamp: moment(i.timestamp).format('llll') })}
                                            legend={i.kegDbId}
                                            rightIcon={
                                                limitReached
                                                    ? <TooltipIconButton icon="info_outline" tooltip={t('button_channelLimit')}
                                                        onClick={this.toggleDialog} />
                                                    : this.inviteOptions(i.kegDbId)
                                            } />)
                                    )}
                                </List>
                            </div>
                        </div>
                        <ChatSideBar open="true" />
                    </div>
                </div>
                <ChannelUpgradeDialog ref={ref => (this.dialog = ref)} />
            </div>
        );
    }
}

module.exports = ChannelInvites;
