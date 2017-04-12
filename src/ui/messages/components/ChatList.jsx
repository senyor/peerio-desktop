const React = require('react');
const { t } = require('peerio-translator');
const { IconButton, List, ListItem, ListSubHeader, ProgressBar, Tooltip } = require('~/react-toolbox');
const { chatStore } = require('~/icebear');
const { observer } = require('mobx-react');
const css = require('classnames');

const TooltipIcon = Tooltip()(IconButton); //eslint-disable-line
const ToolTipDiv = Tooltip()((props) => {
    return (<div style={props.style} className={props.className} onMouseEnter={props.onMouseEnter} onMouseLeave={props.onMouseLeave}>
        {props.children}
    </div>);
});
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
            <div className="message-list">
                {this.getProgressBar(chatStore.loading)}
                <List selectable ripple>
                    <div key="list-header" className="list-header-wrapper">
                        <ListSubHeader caption={t('title_chats')} />
                        <TooltipIcon
                            tooltip={t('title_chatAdd')}
                            tooltipDelay={500}
                            tooltipPosition="right"
                            icon={<div className="new-message" />}
                            onClick={this.newMessage} />
                    </div>
                    {chatStore.chats.map(c =>
                        <ListItem key={c.id || c.tempId} className={css('online', { active: c.active })}
                            onClick={() => this.activateChat(c.id)}
                            itemContent={<ToolTipDiv tooltip={c.chatName} tooltipDelay={500}>{c.chatName}</ToolTipDiv>}
                            // TODO: make left icon user count when multiuser chat.
                            // TODO: add status funcationality
                            // leftIcon="fiber_manual_record"
                            rightIcon={((!c.active || c.newMessagesMarkerPos) && c.unreadCount > 0) ? this.getNotificationIcon(c) : null} />
                        // TODO: add functionality => remove chat item from list
                        // <TooltipIcon
                        //         tooltip={t('title_chatRemove')}
                        //         tooltipDelay={500}
                        //         tooltipPosition="right"
                        //         icon="remove_circle_outline" />} />
                    )}
                </List>
            </div>
        );
    }
}


module.exports = ChatList;
