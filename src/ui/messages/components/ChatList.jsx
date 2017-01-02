const React = require('react');
const { t } = require('peerio-translator');
const { IconButton, List, ListItem, ListSubHeader, ProgressBar, Tooltip } = require('react-toolbox');
const { chatStore } = require('~/icebear');
const { observer } = require('mobx-react');
const css = require('classnames');

const TooltipIcon = Tooltip(IconButton); //eslint-disable-line

@observer
class ChatList extends React.Component {
    componentWillMount() {
        chatStore.loadAllChats();
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
            <div className="message-list">
                {this.getProgressBar(chatStore.loading)}
                <List selectable ripple>
                    <div key="list-header" className="list-header-wrapper">
                        <ListSubHeader caption={t('directMessages')} />
                        <TooltipIcon
                            tooltip="Add chat"
                            tooltipDelay={500}
                            tooltipPosition="right"
                            icon="add_circle_outline" onClick={this.newMessage} />
                    </div>
                    {chatStore.chats.map(c =>
                        <ListItem key={c.id || c.tempId} className={css('online', { active: c.active })}
                            onClick={() => this.activateChat(c.id)}
                            caption={c.chatName}
                            // TODO: make left icon user count when multiuser chat.
                            leftIcon="fiber_manual_record"
                            rightIcon={(!c.active && c.unreadCount > 0) ? this.getNotificationIcon(c) :
                                <TooltipIcon
                                    tooltip="Remove from list"
                                    tooltipDelay={500}
                                    tooltipPosition="right"
                                    icon="remove_circle_outline" />} />
                    )}
                </List>
            </div>
        );
    }
}


module.exports = ChatList;
