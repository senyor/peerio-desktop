const React = require('react');
const { observer } = require('mobx-react');
const { Button, FontIcon, List, ListSubHeader, ListItem, TooltipIconButton } = require('~/react-toolbox');
const ChatList = require('./components/ChatList');
const ChatSideBar = require('./components/ChatSideBar');
const { t } = require('peerio-translator');

@observer
class ChannelInvites extends React.Component {

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
                                <List selectable>
                                    <ListSubHeader caption="Recent invites" />
                                    <ListItem caption="#channel name" legend="Invited by someone at this time"
                                    rightIcon={
                                      limitReached
                                        ? <TooltipIconButton icon="info_cirle" tooltip={t('button_channelLimit')}
                                          onClick={this.limitDialog} />
                                        : this.inviteOptions()
                                    } />
                                </List>
                                <List selectable>
                                    <ListSubHeader caption="Pending invites" />
                                    <ListItem caption="#channel name"
                                      legend="Invited by someone at this time"
                                      rightIcon={
                                        limitReached
                                          ? <TooltipIconButton icon="info_cirle" tooltip={t('button_channelLimit')}
                                            onClick={this.limitDialog} />
                                          : this.inviteOptions()
                                      } />
                                    <ListItem caption="#channel name"
                                      legend="Invited by someone at this time"
                                      rightIcon={
                                        limitReached
                                          ? <TooltipIconButton icon="info_cirle" tooltip={t('button_channelLimit')}
                                            onClick={this.limitDialog} />
                                          : this.inviteOptions()
                                      } />
                                    <ListItem caption="#channel name"
                                      legend="Invited by someone at this time"
                                      rightIcon={
                                        limitReached
                                          ? <TooltipIconButton icon="info_cirle" tooltip={t('button_channelLimit')}
                                            onClick={this.limitDialog} />
                                          : this.inviteOptions()
                                      } />
                                    <ListItem caption="#channel name"
                                      legend="Invited by someone at this time"
                                      rightIcon={
                                        limitReached
                                          ? <TooltipIconButton icon="info_cirle" tooltip={t('button_channelLimit')}
                                            onClick={this.limitDialog} />
                                          : this.inviteOptions()
                                      } />
                                </List>
                            </div>
                        </div>
                        <ChatSideBar open="true" />
                    </div>
                </div>
            </div>
        );
    }
}

module.exports = ChannelInvites;
