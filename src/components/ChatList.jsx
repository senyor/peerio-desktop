const React = require('react');
const { t } = require('peerio-translator');
const { IconButton, List, ListItem, ListSubHeader, ProgressBar } = require('react-toolbox');
const {chatStore} = require('../icebear'); //eslint-disable-line
const { observer } = require('mobx-react');

@observer
class ChatList extends React.Component {
    componentWillMount() {
        chatStore.loadAllChats();
    }

    activateChat(id) {
        chatStore.activate(id);
    }

    newMessage = () => {
        this.context.router.push('/app/new-message');
    };
/* <ListItem caption="Bill" className="online" leftIcon="fiber_manual_record"
   rightIcon={<div className="notification">12</div>} />*/
    render() {
        // todo: remove arrow function event handler
        return (
            <div className="message-list">
                {chatStore.loading ? <ProgressBar type="linear" mode="indeterminate" /> : null}
                <List selectable ripple>
                    <div className="list-header-wrapper">
                        <ListSubHeader caption={t('directMessages')} />
                        <IconButton icon="add_circle_outline" onClick={this.newMessage} />
                    </div>
                    {chatStore.chats.map(c =>
                         c.loadingMeta ? <ProgressBar type="linear" mode="indeterminate" key={c.id} />
                                       : <ListItem className={c.active ? 'active' : ''} key={c.id}
                                                   onClick={() => this.activateChat(c.id)}
                                                   caption={c.participants[0].username}
                                                    leftIcon="fiber_manual_record" />
                    )}
                </List>
            </div>
        );
    }
}

ChatList.contextTypes = {
    router: React.PropTypes.object
};

module.exports = ChatList;
