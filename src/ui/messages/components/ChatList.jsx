const React = require('react');
const { t } = require('peerio-translator');
const { Button, List, ListItem, ProgressBar, Tooltip } = require('~/react-toolbox');
const Avatar = require('~/ui/shared-components/Avatar');
const { chatStore } = require('~/icebear');
const { observer } = require('mobx-react');
const css = require('classnames');
const getSystemMessageText = require('~/helpers/system-messages');

const ToolTipDiv = Tooltip()(props =>
    <div style={props.style} className={props.className}
        onMouseEnter={props.onMouseEnter} onMouseLeave={props.onMouseLeave}>
        {props.children}
    </div>
);
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
        if (!c.mostRecentMessage) return '';
        if (c.mostRecentMessage.systemData) {
            return getSystemMessageText(c.mostRecentMessage);
        }
        return c.mostRecentMessage.text;
    }
    render() {
        return (
            <div className="chat-list">
                {this.getProgressBar(chatStore.loading)}
                <div className="wrapper-button-add-chat">
                    <Button icon="add" accent mini onClick={this.newMessage} floating />
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
                                <span>
                                    <span className="rt-list-itemText rt-list-primary">
                                        {c.isFavorite ? <span className="starred">&#x2605;</span> : null}
                                        {c.chatName}
                                    </span>
                                    <span className="rt-list-itemText">{this.renderMostRecentMessage(c)}</span>
                                </span>
                            } />
                    )}
                </List>
            </div>
        );
    }
}

module.exports = ChatList;
