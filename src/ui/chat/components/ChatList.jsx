const React = require('react');
const { t } = require('peerio-translator');
const { Button, List, ListItem, ProgressBar, TooltipDiv } = require('~/react-toolbox');
const MaintenanceWarning = require('~/ui/shared-components/MaintenanceWarning');
const Avatar = require('~/ui/shared-components/Avatar');
const { chatStore, User, systemMessages, clientApp, chatInviteStore } = require('~/icebear');
const { observer } = require('mobx-react');
const { computed } = require('mobx');
const css = require('classnames');
const FlipMove = require('react-flip-move');
const routerStore = require('~/stores/router-store');

@observer
class ChatList extends React.Component {
    @computed get inRoomInvites() {
        return routerStore.currentRoute === '/app/channel-invites';
    }

    activateChat(id) {
        // need this because of weirdly composed channel invites
        routerStore.navigateTo(routerStore.ROUTES.chats);
        clientApp.isInChatsView = true;
        chatStore.activate(id);
    }

    newMessage = () => {
        window.router.push(routerStore.ROUTES.newChat);
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
                            <MaintenanceWarning />
                            <List selectable ripple>
                                <TooltipDiv tooltip={t('title_addRoom')}
                                    tooltipPosition="right">
                                    <div className="chat-item-add" onClick={this.newChannel} >
                                        <div className="chat-item-title">{t('title_channels')}</div>
                                        <div className="chat-item-add-icon" />
                                    </div>
                                </TooltipDiv>
                                <li className={css('room-invites-button-container',
                                    { show: newChatInvites > 0 }
                                )}>
                                    <Button key="room-invites"
                                        className={css(
                                            'room-invites-button',
                                            'button-neutral',
                                            { selected: this.inRoomInvites }
                                        )}
                                        onClick={this.goToChannelInvite}>
                                        {t('title_viewChannelInvites')}
                                    </Button>
                                </li>
                                <FlipMove duration={200} easing="ease-in-out" >
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
                                        className={css('dm-item', { active: routerStore.isNewChat })}
                                        leftIcon={<div className="new-dm-avatar material-icons">help_outline</div>}
                                        itemContent={
                                            <TooltipDiv className="item-content"
                                                tooltip={t('title_newDirectMessage')}
                                                tooltipDelay={500}
                                                tooltipPosition="right">
                                                <span className="rt-list-primary new-dm-list-entry">
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
                                                <TooltipDiv className="item-content"
                                                    tooltip={c.name}
                                                    tooltipDelay={500}
                                                    tooltipPosition="right">
                                                    <span className="rt-list-primary">
                                                        {c.isFavorite
                                                            ? <span className="starred">&#x2605;</span>
                                                            : null}
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
