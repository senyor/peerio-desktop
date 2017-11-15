const React = require('react');
const { observer } = require('mobx-react');
const { chatStore } = require('~/icebear');
const css = require('classnames');
const FilesSection = require('./FilesSection');

@observer
class ChatSideBar extends React.Component {
    render() {
        const chat = chatStore.activeChat;
        if (!chat) return null;
        return (
            <div className={css('chat-sidebar', { open: this.props.open })}>
                <FilesSection open />
            </div>
        );
    }
}

module.exports = ChatSideBar;
