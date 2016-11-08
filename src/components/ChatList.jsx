const React = require('react');
const { withRouter } = require('react-router');
const { t } = require('peerio-translator');
const { IconButton, List, ListItem, ListSubHeader, ProgressBar } = require('react-toolbox');
const { chatStore } = require('../icebear'); //eslint-disable-line
const { observer } = require('mobx-react');
const css = require('classnames');

@observer
class ChatList extends React.Component {
    componentWillMount() {
        chatStore.loadAllChats();
    }

    activateChat(id) {
        chatStore.activate(id);
    }

    newMessage = () => {
        this.props.router.push('/app/new-message');
    };

    getProgressBar =loading => {
        return loading ? <ProgressBar type="linear" mode="indeterminate" /> : null;
    };

    getNotificationIcon = chat => {
        return (<div className="notification">{chat.unreadCount}</div>);
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
                        <IconButton icon="add_circle_outline" onClick={this.newMessage} />
                    </div>
                    {chatStore.chats.map(c =>
                        <ListItem key={c.id || c.tempId} className={css('online', { active: c.active })}
                            itemContent={this.getProgressBar(c.loadingMeta)}
                            onClick={() => this.activateChat(c.id)}
                            caption={c.chatName}
                            leftIcon="fiber_manual_record"
                            // leftIcon={c.participants.length < 2 ? 'fiber_manual_record' :
                            //     <div className="small-notification">
                            //         {c.participants.length}</div>}
                            rightIcon={this.getNotificationIcon(c)} />

                    )}
                </List>
            </div>
        );
    }
}


module.exports = withRouter(ChatList);
