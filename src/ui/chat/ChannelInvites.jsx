const React = require('react');
const { observable } = require('mobx');
const { observer } = require('mobx-react');
const { Button, Dialog, Link, List, ListSubHeader, ListItem, TooltipIconButton } = require('~/react-toolbox');
const ChatList = require('./components/ChatList');
const ChatSideBar = require('./components/ChatSideBar');
const { t } = require('peerio-translator');
const { chatInviteStore, clientApp } = require('~/icebear');

@observer
class ChannelInvites extends React.Component {
    @observable showDialog = false;

    componentWillMount() {
        clientApp.isInChatsView = false;
    }

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
        const limitReached = false;

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
                                <div className="upgrade-channels">
                                    <div><span role="img" aria-label="waving hand">👋</span>Hello! Your account can access <strong>2 channels</strong> at a time. <Link to="/upgrade">Upgrade</Link> for access to unlimited channels.</div>
                                    {/* <Button flat primary label={t('button_upgrade')} /> */}
                                </div>
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
                    title={t('title_limitDialog')}
                    className="dialog-warning">
                    <p>{t('title_limitDialogText1')}</p>
                    {/* Your account can access 2 channels at a time. */}
                    <br />
                    <p>{t('title_limitDialogText2')}</p>
                    {/* If you would like to join or create another channel, please leave an existing channel or upgrade your account. */}
                </Dialog>
            </div>
        );
    }
}

module.exports = ChannelInvites;
