const React = require('react');
const { observer } = require('mobx-react');
const { ProgressBar } = require('~/react-toolbox');
const Avatar = require('~/ui/shared-components/Avatar');
const Message = require('./Message');
const { chatStore } = require('~/icebear');
const { t } = require('peerio-translator');

@observer
class MessageList extends React.Component {

    componentDidMount() {
        this.scrollToBottom();
    }
    componentDidUpdate() {
        this.scrollToBottom();
    }
    scrollToBottom() {
        const el = document.getElementsByClassName('messages-container')[0];
        if (!el) return;
        setTimeout(() => { el.scrollTop = el.scrollHeight; }, 100);
    }
    renderMessages() {
        const ret = [];
        const msgs = chatStore.activeChat.messages;
        for (let i = 0; i < msgs.length; i++) {
            const m = msgs[i];
            if (m.firstOfTheDay) {
                const ts = m.timestamp.toLocaleDateString();
                ret.push(<div key={ts + m.id} className="message-content-wrapper">
                    <div className="date-marker">
                        <div className="date">{ts === new Date().toLocaleDateString() ? t('today') : ts}</div>
                    </div>
                </div>);
            }
            ret.push(<Message key={m.id || m.tempId} message={m} />);
        }
        return ret;
    }
    render() {
        if (!chatStore.activeChat) return null;
        return (
            <div className="messages-container">
                <div className="message-content-wrapper messages-start">
                    <div className="avatars">
                        {chatStore.activeChat.participants.map(c =>
                            <Avatar contact={c} />)}
                    </div>
                    <div className="title">
                        This is the beginning of your chat history with
                        &nbsp;<strong>{chatStore.activeChat.chatName}</strong>.
                    </div>
                </div>
                {chatStore.activeChat.loadingMessages
                    ? <ProgressBar type="circular" mode="indeterminate"
                                   multicolor className="messages-progress-bar" />
                    : this.renderMessages()
                }
            </div>
        );
    }
}


module.exports = MessageList;
