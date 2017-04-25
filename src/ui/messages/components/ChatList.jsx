const React = require('react');
const { t } = require('peerio-translator');
const { List, ListItem, ListSubHeader, ProgressBar, Tooltip, TooltipIconButton } = require('~/react-toolbox');
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
                <List selectable ripple>
                    <div key="list-header" className="list-header-wrapper">
                        <ListSubHeader caption={t('title_chats')} />
                        <TooltipIconButton
                            tooltip={t('title_chatAdd')}
                            tooltipDelay={500}
                            tooltipPosition="right"
                            icon={<div className="new-message" />}
                            onClick={this.newMessage} />
                    </div>
                    {chatStore.chats.map(c =>
                        <ListItem key={c.id || c.tempId} className={css('online', { active: c.active })}
                            onClick={() => this.activateChat(c.id)}
                            itemContent={<ToolTipDiv tooltip={c.chatName}
                                tooltipDelay={500}
                                className="flex-grow-1">{c.chatName}</ToolTipDiv>}
                            // TODO: make left icon user count when multiuser chat.
                            // TODO: add status funcationality
                            // leftIcon="fiber_manual_record"
                            rightIcon={
                                ((!c.active || c.newMessagesMarkerPos) && c.unreadCount > 0)
                                    ? this.getNotificationIcon(c)
                                    : <TooltipIconButton
                                        tooltip={t('title_chatRemove')}
                                        tooltipDelay={500}
                                        tooltipPosition="right"
                                        onClick={c.hide}
                                        icon="remove_circle_outline" />
                            } />
                    )}
                </List>
            </div>
        );
    }
}


module.exports = ChatList;
