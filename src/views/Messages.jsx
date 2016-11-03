const React = require('react');
const { observable } = require('mobx');
const { observer } = require('mobx-react');
const { IconButton, Panel } = require('react-toolbox');
const Search = require('../components/Search');
const ChatList = require('../components/ChatList');
const MessageInput = require('../components/MessageInput');
const Message = require('../components/Message');
const chatStore = require('../stores/chat-store');

@observer
class Messages extends React.Component {

    render() {
        return (
            <Panel>
                <div className="messages">
                    <ChatList />
                    <div className="message-view">
                        <div className="message-toolbar">
                            <div className="title">Alice</div>
                            <Search />
                            <IconButton icon="info_outline" />
                        </div>
                        {
                            chatStore.activeChat
                                ?
                                    <div className="messages-container">
                                        {chatStore.activeChat.messages.map(m =>
                                            <Message key={m.id} username={m.sender.username}
                                                     timestamp={m.timestamp} text={m.text} />
                                        )}
                                    </div>
                                :
                                    <div style={{ alignSelf: 'center', marginTop: '50%' }}>
                                    Welcome? Some images? Select chat there?
                                    </div>
                        }
                        <MessageInput onSend={(m) => console.log('send: ', m)} />
                    </div>
                </div>
            </Panel>
        );
    }
}

module.exports = Messages;
