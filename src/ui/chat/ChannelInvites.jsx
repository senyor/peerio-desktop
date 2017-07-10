const React = require('react');
const { observable } = require('mobx');
const { observer } = require('mobx-react');
const { Button, Dialog, List, ListSubHeader, ListItem, TooltipIconButton } = require('~/react-toolbox');
const ChatList = require('./components/ChatList');
const ChatSideBar = require('./components/ChatSideBar');
const { t } = require('peerio-translator');

@observer
class ChannelInvites extends React.Component {
    @observable showDialog = false;

    inviteOptions() {
        return (<div>
            <Button label={t('button_Accept')}
                    onClick={this.acceptInvite}
                    flat primary />
            <Button label={t('button_Decline')}
                    onClick={this.declineInvite}
                    flat />
        </div>
        );
    }

    acceptInvite = () => {
        console.log('Invite accepted');
    }

    declineInvite = () => {
        console.log('Invite declined');
    }

    handleUpgrade = () => {
        console.log('Handling upgrade!');
    }

    toggleDialog = () => {
        console.log(this.showDialog);
        this.showDialog = !this.showDialog;
    }

    render() {
        const limitReached = true;

        const dialogActions = [
            { label: t('button_cancel'), onClick: () => { this.toggleDialog(); } },
            {
                label: t('button_upgrade'),
                onClick: () => {
                    this.handleUpgrade();
                    this.toggleDialog();
                }
            }
        ];

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
                <Dialog active={this.showDialog}
                    actions={dialogActions}
                    onOverlayClick={this.toggleDialog}
                    onEscKeyDown={this.toggleDialog}
                    title={t('title_limitDialog')}>
                    <p>Limit content p1</p>
                    <p>Limit content p2</p>
                </Dialog>
            </div>
        );
    }
}

module.exports = ChannelInvites;
