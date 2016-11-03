const React = require('react');
const { observable } = require('mobx');
const { observer } = require('mobx-react');
const { IconButton } = require('react-toolbox');
const Search = require('../components/Search');
const ChatList = require('../components/ChatList');
const MessageInput = require('../components/MessageInput');
const Message = require('../components/Message');
const {chatStore} = require('../icebear');// eslint-disable-line

@observer
class Messages extends React.Component {

    render() {
        return (
            <div className="flex-row">
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
                                    <div className="flex-col"
                                        style={{ alignSelf: 'center', justifyContent: 'center', height: '100vh' }}>
                                    Welcome? Some images? Select chat there?
                                    </div>
                        }
                        <MessageInput onSend={(m) => console.log('send: ', m)} />
                    </div>
                </div>
            </div>
        );
    }
}

module.exports = Messages;
