const React = require('react');
const { t } = require('peerio-translator');
const { Button, List, ListItem, ProgressBar, TooltipDiv } = require('~/react-toolbox');
const MaintenanceWarning = require('~/ui/shared-components/MaintenanceWarning');
const Avatar = require('~/ui/shared-components/Avatar');
const { chatStore, User, systemMessages, chatInviteStore } = require('peerio-icebear');
const { observer } = require('mobx-react');
const css = require('classnames');
const FlipMove = require('react-flip-move');
const routerStore = require('~/stores/router-store');

@observer
class ChatList extends React.Component {
    activateChat(id) {
        routerStore.navigateTo(routerStore.ROUTES.chats);
        chatStore.activate(id);
    }

    newMessage = () => {
        routerStore.navigateTo(routerStore.ROUTES.newChat);
    };

    newChannel() {
        chatStore.deactivateCurrentChat();
        routerStore.navigateTo(routerStore.ROUTES.newChannel);
    }

    goToChannelInvite() {
        routerStore.navigateTo(routerStore.ROUTES.channelInvites);
    }

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
        let { username } = m.sender;
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
                            <MaintenanceWarning />
                            <List selectable ripple>
                                <TooltipDiv tooltip={t('title_addRoom')}
                                    tooltipPosition="right">
                                    <div className="chat-item-add" onClick={this.newChannel} >
                                        <div className="chat-item-title">{t('title_channels')}</div>
                                        <div className="chat-item-add-icon" />
                                    </div>
                                </TooltipDiv>

                                <FlipMove duration={200} easing="ease-in-out" >
                                    {newChatInvites > 0 &&
                                        <li className="room-invites-button-container">
                                            <Button key="room-invites"
                                                className={css(
                                                    'room-invites-button',
                                                    'button-affirmative',
                                                    { selected: routerStore.isRoomInvites }
                                                )}
                                                onClick={this.goToChannelInvite}>
                                                {t('title_viewChannelInvites')}
                                            </Button>
                                        </li>
                                    }
                                    {routerStore.isNewChannel &&
                                        <ListItem key="new channel"
                                            className="room-item new-room-entry active"
                                            caption={`# ${t('title_newRoom')}`}
                                        />
                                    }
                                    {chatStore.channels.map(c =>
                                        (<ListItem key={c.id || c.tempId}
                                            className={
                                                css('room-item', { active: c.active, unread: c.unreadCount > 0 })
                                            }
                                            caption={`# ${c.name}`}
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
                            <List selectable ripple>
                                <TooltipDiv tooltip={t('title_addDirectMessage')}
                                    tooltipPosition="right">
                                    <div className="chat-item-add" onClick={this.newMessage}>
                                        <div className="chat-item-title">{t('title_directMessages')}</div>
                                        <div className="chat-item-add-icon" />
                                    </div>
                                </TooltipDiv>
                                {routerStore.isNewChat &&
                                    <ListItem key="new chat"
                                        className={css(
                                            'dm-item', 'new-dm-list-entry', { active: routerStore.isNewChat }
                                        )}
                                        leftIcon={<div className="new-dm-avatar material-icons">help_outline</div>}
                                        itemContent={
                                            <TooltipDiv className="item-content"
                                                tooltip={t('title_newDirectMessage')}
                                                tooltipPosition="right">
                                                <span className="rt-list-primary">
                                                    <i>{t('title_newDirectMessage')}</i>
                                                </span>
                                            </TooltipDiv>
                                        }
                                    />}
                                <FlipMove duration={200} easing="ease-in-out">
                                    {chatStore.directMessages.map(c =>
                                        (<ListItem key={c.id || c.tempId}
                                            className={css('dm-item', { active: c.active, unread: c.unreadCount > 0 })}
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
                                                <div className="item-content">
                                                    <span className="rt-list-primary">
                                                        {c.isFavorite
                                                            ? <span className="starred">&#x2605;</span>
                                                            : null}
                                                        {c.name}
                                                    </span>
                                                    {/* <span className="rt-list-itemText">
                                                        {this.renderMostRecentMessage(c)}
                                                    </span> */}
                                                </div>
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
