const React = require('react');
const { observer } = require('mobx-react');
const { Button, List, ListItem, TooltipIconButton } = require('~/react-toolbox');
const ChatList = require('./components/ChatList');
const { t } = require('peerio-translator');
const { chatInviteStore, chatStore, User } = require('peerio-icebear');
const ChannelUpgradeOffer = require('./components/ChannelUpgradeOffer');
const ChannelUpgradeDialog = require('./components/ChannelUpgradeDialog');
const moment = require('moment');
const { getAttributeInParentChain } = require('~/helpers/dom');
const T = require('~/ui/shared-components/T');

@observer
class ChannelInvites extends React.Component {
    componentWillMount() {
        chatStore.deactivateCurrentChat();
    }

    inviteOptions(kegDbId) {
        return (<div data-kegdbid={kegDbId}>
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

    acceptInvite = (ev) => {
        const id = getAttributeInParentChain(ev.target, 'data-kegdbid');
        chatInviteStore.acceptInvite(id);
    }

    rejectInvite = (ev) => {
        const id = getAttributeInParentChain(ev.target, 'data-kegdbid');
        chatInviteStore.rejectInvite(id);
    }

    get isLimitReached() {
        return User.current.channelsLeft === 0;
    }

    render() {
        return (
            <div className="messages channel-invites">
                <ChatList />
                {chatInviteStore.received.length
                    ? <div className="message-view">
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
                                <div className="room-invites-list-container">
                                    <ChannelUpgradeOffer />
                                    <List className="room-invites-list">
                                        {chatInviteStore.received.map(i =>
                                            (<ListItem
                                                key={`${i.kegDbId}${i.username}${i.timestamp}`}
                                                caption={`# ${i.channelName}`}
                                                legend={
                                                    t('title_invitedBy',
                                                        {
                                                            username: i.username,
                                                            timestamp: moment(i.timestamp).format('L')
                                                        })
                                                }
                                                rightIcon={this.inviteOptions(i.kegDbId)}
                                                selectable={false}
                                                ripple={false}
                                            />)
                                        )}
                                    </List>
                                </div>
                            </div>
                        </div>
                    </div>
                    : <div className="zero-invites-container">
                        <div className="content">
                            <div className="emoji-double emojione-32-people _1f44d" alt="👍" title=":thumbsup:" />
                            <T k="title_allCaughtUp" className="title" tag="div" />
                            <T k="title_noMoreInvites" className="subtitle" tag="div" />
                        </div>
                    </div>
                }
                <ChannelUpgradeDialog />
            </div>
        );
    }
}

module.exports = ChannelInvites;
