const React = require('react');
const { observable, reaction } = require('mobx');
const { observer } = require('mobx-react');
const { FontIcon, IconButton, Input, List, ListItem, Tooltip } = require('~/react-toolbox');
const ChatList = require('./components/ChatList');
const MessageInput = require('./components/MessageInput');
const MessageList = require('./components/MessageList');
const NoChatSelected = require('./components/NoChatSelected');
const { chatStore } = require('~/icebear');
const sounds = require('~/helpers/sounds');
const UploadInChatProgress = require('./components/UploadInChatProgress');
const { t } = require('peerio-translator');
const css = require('classnames');

const TooltipIcon = Tooltip()(IconButton); //eslint-disable-line

@observer
class Messages extends React.Component {
    @observable sidebarOpen = false;
    @observable chatStarred = false;

    componentWillMount() {
        if (chatStore.activeChat) chatStore.activeChat.loadMessages();
        this.loaderDisposer = reaction(() => chatStore.activeChat, () => chatStore.activeChat.loadMessages());
    }
    componentWillUnmount() {
        this.loaderDisposer();
    }

    sendMessage(m) {
        sounds.sending.play();
        chatStore.activeChat.sendMessage(m)
            .then(() => sounds.sent.play())
            .catch(() => sounds.destroy.play());
    }
    sendAck() {
        sounds.sending.play();
        chatStore.activeChat.sendAck()
            .then(() => sounds.sent.play())
            .catch(() => sounds.destroy.play());
    }
    shareFiles = (files) => {
        sounds.sending.play();
        chatStore.activeChat.shareFiles(files)
            .then(() => sounds.sent.play())
            .catch(() => sounds.destroy.play());
    };

    handleSidebar = () => {
        this.sidebarOpen = !this.sidebarOpen;
    }

    handleStar = () => {
        this.chatStarred = !this.chatStarred;
    }

    render() {
        return (
            <div className="messages">
                <ChatList />
                <div className="message-view">
                    <div className="message-toolbar flex-justify-between">
                        <div className="flex-col">
                            <div className="title">
                                <div className="title-content">
                                    {chatStore.activeChat && chatStore.activeChat.chatName}
                                </div>
                                <FontIcon value="edit" />
                            </div>
                            <div className="flex-row meta-nav">
                                <TooltipIcon icon={this.chatStarred ? 'star' : 'star_border'}
                                             onClick={this.handleStar}
                                             className={css({ starred: this.chatStarred })}
                                             tooltip={t('title_starChannel')}
                                             tooltipPosition="bottom"
                                             tooltipDelay={500} />
                                <div className="member-count">
                                    <TooltipIcon icon="person"
                                                 tooltip={t('title_memberCount')}
                                                 tooltipPosition="bottom"
                                                 tooltipDelay={500}
                                                 onClick={this.handleSidebar} /> 1
                                </div>

                            </div>
                        </div>
                        <IconButton icon="chrome_reader_mode" onClick={this.handleSidebar} />
                    </div>
                    <div className="flex-row flex-grow-1">
                        <div className="flex-col flex-grow-1">
                            {(chatStore.chats.length === 0 && !chatStore.loading)
                                ? <NoChatSelected />
                                : <MessageList />}
                            {chatStore.activeChat && chatStore.activeChat.uploadQueue.length
                                ? <UploadInChatProgress queue={chatStore.activeChat.uploadQueue} />
                                : null}
                            <MessageInput show={!!chatStore.activeChat && chatStore.activeChat.metaLoaded}
                                onSend={this.sendMessage} onAck={this.sendAck} onFileShare={this.shareFiles} />
                        </div>
                        <div className={css('chat-sidebar', { open: this.sidebarOpen })}>
                            <Input value={chatStore.activeChat && chatStore.activeChat.chatName} />
                            <div>{t('title_Members')}</div>
                            <List selectable>
                                <ListItem caption="Person 1" />
                                <ListItem caption="Person 2" />
                                <ListItem caption="Person 2" />
                            </List>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


module.exports = Messages;
