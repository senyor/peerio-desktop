const React = require('react');
const { observer } = require('mobx-react');
const { List, ListItem } = require('~/react-toolbox');
const Avatar = require('~/ui/shared-components/Avatar');
const { chatStore } = require('~/icebear');
const { t } = require('peerio-translator');
const css = require('classnames');
const ChatNameEditor = require('./ChatNameEditor');

@observer
class ChatSideBar extends React.Component {
    render() {
        return (
            <div className={css('chat-sidebar', { open: this.props.open })}>
                <div className="title">{t('title_About')}</div>
                <div className="flex-row flex-shrink-0">
                    <ChatNameEditor showLabel />
                </div>
                <List selectable>
                    <ListItem
                      leftIcon="remove_circle_outline"
                      caption="button_hideChat"
                      onClick={chatStore.activeChat.hide}
                    />
                    {/* <ListItem
                      leftIcon="notifications_none"
                      caption="button_muteChat" /> */}
                </List>
                <div className="rt-list-subheader">{t('title_Members')} </div>
                <div style={{ overflow: 'auto' }}>
                    <List>
                        {chatStore.activeChat && chatStore.activeChat.participants ?
                            chatStore.activeChat.participants.map(c =>
                                <ListItem key={c.username}
                                    leftActions={[<Avatar key="a" contact={c} />]}
                                    caption={c.username}
                                    legend={c.fullName} />
                            ) : null}
                    </List>
                </div>
            </div>
        );
    }
}

module.exports = ChatSideBar;
