const React = require('react');
const { t } = require('peerio-translator');
const { Avatar, Button, List, ListItem, ProgressBar, Tooltip } = require('~/peer-ui');
const MaintenanceWarning = require('~/ui/shared-components/MaintenanceWarning');
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
                            <List clickable>
                                <div>
                                    <div className="chat-item-add" onClick={this.newChannel} >
                                        <div className="chat-item-title">{t('title_channels')}</div>
                                        <div className="chat-item-add-icon" />
                                    </div>
                                    <Tooltip text={t('title_addRoom')}
                                        position="right" />
                                </div>

                                <FlipMove duration={200} easing="ease-in-out" >
                                    {newChatInvites > 0 &&
                                        <li className="room-invites-button-container">
                                            <Button key="room-invites"
                                                label={t('title_viewChannelInvites')}
                                                className="room-invites-button"
                                                theme="affirmative"
                                                onClick={this.goToChannelInvite}
                                            />
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
                                            rightContent={
                                                ((!c.active || c.newMessagesMarkerPos) && c.unreadCount > 0)
                                                    ? this.getNotificationIcon(c)
                                                    : null
                                            } />
                                        )
                                    )}
                                </FlipMove>
                            </List>
                            <List clickable>
                                <div>
                                    <div className="chat-item-add" onClick={this.newMessage}>
                                        <div className="chat-item-title">{t('title_directMessages')}</div>
                                        <div className="chat-item-add-icon" />
                                    </div>
                                    <Tooltip text={t('title_addDirectMessage')}
                                        position="right" />
                                </div>
                                {routerStore.isNewChat &&
                                    <ListItem key="new chat"
                                        className={css(
                                            'dm-item', 'new-dm-list-entry', { active: routerStore.isNewChat }
                                        )}
                                        leftContent={<div className="new-dm-avatar material-icons">help_outline</div>}
                                    >
                                        <i>{t('title_newDirectMessage')}</i>
                                        <Tooltip text={t('title_newDirectMessage')}
                                            position="right" />
                                    </ListItem>
                                }
                                <FlipMove duration={200} easing="ease-in-out">
                                    {chatStore.directMessages.map(c =>
                                        (<ListItem key={c.id || c.tempId}
                                            className={css(
                                                'dm-item',
                                                {
                                                    active: c.active,
                                                    unread: c.unreadCount > 0,
                                                    pinned: c.isFavorite
                                                }
                                            )}
                                            leftContent={
                                                <Avatar
                                                    key="a"
                                                    contact={
                                                        c.otherParticipants.length > 0
                                                            ? c.otherParticipants[0]
                                                            : c.allParticipants[0]
                                                    }
                                                    size="small"
                                                    clickable
                                                    tooltip
                                                />
                                            }

                                            onClick={() => this.activateChat(c.id)}
                                            rightContent={
                                                ((!c.active || c.newMessagesMarkerPos) && c.unreadCount > 0)
                                                    ? this.getNotificationIcon(c)
                                                    : null
                                            }
                                        >
                                            {c.name}
                                            {/* this.renderMostRecentMessage(c) */}
                                        </ListItem>
                                        )
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
