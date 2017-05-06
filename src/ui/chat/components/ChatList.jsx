const React = require('react');
const { t } = require('peerio-translator');
const { FontIcon, List, ListItem, ProgressBar, TooltipDiv } = require('~/react-toolbox');
const Avatar = require('~/ui/shared-components/Avatar');
const { chatStore, User } = require('~/icebear');
const { observer } = require('mobx-react');
const css = require('classnames');
const getSystemMessageText = require('~/helpers/system-messages');

@observer
class ChatList extends React.Component {
    componentWillMount() {
        chatStore.loadAllChats(15);
    }

    activateChat(id) {
        chatStore.activate(id);
    }

    newMessage = () => {
        window.router.push('/app/new-message');
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
            return <em>{getSystemMessageText(m)}</em>;
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
        return (
            <div className="chat-list">
                {this.getProgressBar(chatStore.loading)}
                <div className="wrapper-button-add-chat" onClick={this.newMessage}>
                    <FontIcon value="add" />
                    <div>{t('title_haveAChat')}</div>
                </div>
                <List selectable ripple>
                    {chatStore.chats.map(c =>
                        <ListItem key={c.id || c.tempId} className={css('online', { active: c.active })}
                            leftIcon={
                                !c.participants || c.participants.length !== 1
                                    ? <div className="avatar-group-chat material-icons">people</div>
                                    : null}
                            leftActions={[
                                c.participants && c.participants.length === 1
                                    ? <Avatar key="a" contact={c.participants[0]} />
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
                                    tooltip={c.chatName}
                                    tooltipDelay={500}
                                    tooltipPosition="right">
                                    <span className="rt-list-primary">
                                        {c.isFavorite ? <span className="starred">&#x2605;</span> : null}
                                        {c.chatName}
                                    </span>
                                    <span className="rt-list-itemText">
                                        {this.renderMostRecentMessage(c)}
                                    </span>
                                </TooltipDiv>
                            } />
                    )}
                </List>
            </div>
        );
    }
}

module.exports = ChatList;
