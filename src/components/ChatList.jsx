const React = require('react');
const { t } = require('peerio-translator');
const { IconButton, List, ListItem, ListSubHeader, ProgressBar } = require('react-toolbox');
const chatStore = require('../stores/chat-store');
const { observer } = require('mobx-react');

@observer
class ChatList extends React.Component {
    componentWillMount() {
        chatStore.loadAllChats();
    }

    activateChat(id) {
        chatStore.activate(id);
    }
/* <ListItem caption="Bill" className="online" leftIcon="fiber_manual_record"
   rightIcon={<div className="notification">12</div>} />*/
    render() {
        // todo: remove arrow function event handler
        return (
            <div className="message-list">
                {/*  TODO Maybe move ProgressBar to main view and use the fullscreen Spinner.
                    Also need to change the name of that component.
                    Is there a reason that some part of the messages window would
                    be interactive before the chat list loads?  */}
                {chatStore.loading ? <ProgressBar type="linear" mode="indeterminate" /> : null}
                <List selectable ripple>
                    <div className="list-header-wrapper">
                        <ListSubHeader caption={t('directMessages')} />
                        <IconButton icon="add_circle_outline" />
                    </div>
                    {chatStore.chats.map(c =>
                        <ListItem className={c.active ? 'active' : ''} key={c.id}
                                  onClick={() => this.activateChat(c.id)} caption={c.participants[0]}
                                  leftIcon="fiber_manual_record" />
                    )}
                </List>
            </div>
        );
    }
}

module.exports = ChatList;
