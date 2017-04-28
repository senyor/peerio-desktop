const React = require('react');
const { t } = require('peerio-translator');
const { Avatar, Button, List, ListItem, ProgressBar, Tooltip } = require('~/react-toolbox');
const { chatStore } = require('~/icebear');
const { observer } = require('mobx-react');
const css = require('classnames');

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
    /* <ListItem caption="Bill" className="online" leftIcon="fiber_manual_record"
       rightIcon={<div className="notification">12</div>} />*/
    render() {
        // todo: remove arrow function event handler
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
                            leftIcon={<div className="avatar-group-chat material-icons">people</div>
                                }
                                // FIXME: <Avatar key="a" contact={c.participants[0]} />
                            onClick={() => this.activateChat(c.id)}
                            rightIcon={
                                ((!c.active || c.newMessagesMarkerPos) && c.unreadCount > 0)
                                    ? this.getNotificationIcon(c)
                                    : null
                            }
                            // FIXME: add star to chat name of favourite chat.
                            caption={chatStore.chats[1].isFavorite
                                ? <span className="starred">&#x2605;</span>
                                : c.chatName}
                            legend="last thing said in chat" />
                    )}
                </List>
            </div>
        );
    }
}


module.exports = ChatList;
