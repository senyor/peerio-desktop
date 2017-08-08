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

@observer
class ChannelInvites extends React.Component {
    @observable showDialog = false;

    componentWillMount() {
        clientApp.isInChatsView = false;
        chatStore.deactivateCurrentChat();
    }

    inviteOptions() {
        return (<div>
            <Button label={t('button_accept')}
                onClick={this.acceptInvite}
                flat primary />
            <Button label={t('button_decline')}
                onClick={this.declineInvite}
                flat />
        </div>
        );
    }

    acceptInvite = () => {
        this.dialog.show();
        console.log('Invite accepted');
    }

    declineInvite = () => {
        console.log('Invite declined');
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
                                    <ListSubHeader caption="Recent invites" />
                                    <ListItem caption="#channel name" legend="Invited by PeerioUserName at time"
                                        rightIcon={
                                            limitReached
                                                ? <TooltipIconButton icon="info_outline" tooltip={t('button_channelLimit')}
                                                    onClick={this.toggleDialog} />
                                                : this.inviteOptions()
                                        } />
                                </List>
                                <List selectable>
                                    <ListSubHeader caption="Pending invites" />
                                    <ListItem caption="#channel name"
                                        legend="Invited by PeerioUserName at time"
                                        rightIcon={
                                            limitReached
                                                ? <TooltipIconButton icon="info_outline" tooltip={t('button_channelLimit')}
                                                    onClick={this.toggleDialog} />
                                                : this.inviteOptions()
                                        } />
                                </List>
                            </div>
                        </div>
                        <ChatSideBar open="true" />
                    </div>
                </div>
                <ChannelUpgradeDialog active={this.showDialog} ref={ref => (this.dialog = ref)} />
            </div>
        );
    }
}

module.exports = ChannelInvites;
