const React = require('react');
const { t } = require('peerio-translator');
const { FontIcon, List, ListItem, ListSubHeader, ProgressBar, TooltipDiv } = require('~/react-toolbox');
const Avatar = require('~/ui/shared-components/Avatar');
const { chatStore, User, systemMessages, clientApp, chatInviteStore } = require('~/icebear');
const { observer } = require('mobx-react');
const css = require('classnames');
const FlipMove = require('react-flip-move');
const routerStore = require('~/stores/router-store');

@observer
class ChatList extends React.Component {
    activateChat(id) {
        // need this bcs of weirdly composed channel invites
        routerStore.navigateTo(routerStore.ROUTES.chats);
        clientApp.isInChatsView = true;
        chatStore.activate(id);
    }

    newMessage = () => {
        window.router.push('/app/new-chat');
    };

    newChannel() {
        window.router.push('/app/new-channel');
    }

    goToChannelInvite = () => {
        window.router.push('/app/channel-invites');
    };

    getProgressBar = loading => {
        return loading ? <ProgressBar type="linear" mode="indeterminate" /> : null;
    };

    getNotificationIcon = chat => {
        const c = chat.unreadCount;
        return c > 0 ? (<div className="notification">{c}</div>) : null;
    };

    renderMostRecentMessage(c) {
        const m = c.mostRecentMessage;
        if (!m) return '';
        if (m.systemData) {
            return <em>{systemMessages.getSystemMessageText(m)}</em>;
        }
        let username = m.sender.username;
        if (username === User.current.username) username = t('title_you');
        return (
            <span><strong>{username}:</strong>&nbsp;
                {m.files && m.files.length
                    ? t('title_filesShared', { count: m.files.length })
                    : m.text}
            </span>
        );
    }

    render() {
        const newChatInvites = chatInviteStore.received.length;
        return (
            <div className="feature-navigation-list">
                {/* TODO: use a general full width progress bar instead of this one. */}
                {this.getProgressBar(chatStore.loading)}
                {
                    !chatStore.loaded
                        ? null
                        :
                        <div className="list">
                            {chatStore.hasChannels || newChatInvites > 0 ?
                                <List selectable ripple>
                                    <div className="chat-item-add" onClick={this.newChannel}>
                                        <div className="chat-item-title">{t('title_channels')}</div>
                                        <div className="chat-item-add-icon" />
                                    </div>
                                    {newChatInvites > 0 ?
                                        <ListItem key="room-invites" className="room-invites"
                                            onClick={this.goToChannelInvite}
                                            caption="Room invites"
                                            rightIcon={<div className="notification">{newChatInvites}</div>} />
                                        : null}
                                    <FlipMove duration={200} easing="ease-in-out" >
                                        {chatStore.channels.map(c =>
                                            (<ListItem key={c.id || c.tempId}
                                                className={css('room-item', { active: c.active })}
                                                caption={`#${c.name}`}
                                                onClick={() => this.activateChat(c.id)}
                                                rightIcon={
                                                    ((!c.active || c.newMessagesMarkerPos) && c.unreadCount > 0)
                                                        ? this.getNotificationIcon(c)
                                                        : null
                                                } />
                                            )
                                        )}
                                    </FlipMove>
                                </List>
                                : null}
                            <List selectable ripple>
                                <div className="chat-item-add" onClick={this.newMessage}>
                                    <div className="chat-item-title">{t('title_directMessages')}</div>
                                    <div className="chat-item-add-icon" />
                                </div>
                                <FlipMove duration={200} easing="ease-in-out">
                                    {chatStore.directMessages.map(c =>
                                        (<ListItem key={c.id || c.tempId}
                                            className={css('dm-item', { active: c.active })}
                                            leftIcon={
                                                !c.participants || c.participants.length !== 1
                                                    ? <div className="avatar-group-chat material-icons">people</div>
                                                    : null}
                                            leftActions={[
                                                c.participants && c.participants.length === 1
                                                    ? <Avatar key="a" contact={c.participants[0]} size="small" />
                                                    : null
                                            ]}

                                            onClick={() => this.activateChat(c.id)}
                                            rightIcon={
                                                ((!c.active || c.newMessagesMarkerPos) && c.unreadCount > 0)
                                                    ? this.getNotificationIcon(c)
                                                    : null
                                            }
                                            itemContent={
                                                <TooltipDiv className="item-content"
                                                    tooltip={c.name}
                                                    tooltipDelay={500}
                                                    tooltipPosition="right">
                                                    <span className="rt-list-primary">
                                                        {c.isFavorite ? <span className="starred">&#x2605;</span> : null}
                                                        {c.name}
                                                    </span>
                                                    {/* <span className="rt-list-itemText">
                                                        {this.renderMostRecentMessage(c)}
                                                    </span> */}
                                                </TooltipDiv>
                                            } />)
                                    )}
                                </FlipMove>
                            </List>
                        </div>
                }
            </div>
        );
    }
}

module.exports = ChatList;
