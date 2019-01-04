import React from 'react';
import { action, computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import css from 'classnames';
import { DropTarget } from 'react-dnd';

import { chatStore, t } from 'peerio-icebear';
import { Chat } from 'peerio-icebear/dist/models';

import uiStore from '~/stores/ui-store';
import sounds from '~/helpers/sounds';

import DragDropTypes from '../files/helpers/dragDropTypes';
import MessageInput from './components/MessageInput';
import MessageList from './components/MessageList';
import ShareToChatProgress from './components/ShareToChatProgress';

function playErrorSound(): void {
    if (uiStore.prefs.errorSoundsEnabled) sounds.destroy.play();
}

interface ChatMainViewProps {
    chat: Chat;
    onDropFiles: (files: string[]) => void;
    connectDropTarget?: (el: JSX.Element) => JSX.Element;
    isBeingDraggedOver?: boolean;
}

@DropTarget<ChatMainViewProps>(
    [DragDropTypes.NATIVEFILE],
    {
        drop(props, monitor) {
            if (monitor.didDrop()) return; // drop was already handled
            props.onDropFiles(monitor.getItem().files.map(f => f.path));
        }
    },
    (connect, monitor) => ({
        connectDropTarget: connect.dropTarget(),
        isBeingDraggedOver: monitor.isOver({ shallow: true })
    })
)
@observer
export default class ChatMainView extends React.Component<ChatMainViewProps> {
    scrollToBottom(): void {
        if (this.messageListRef.current) {
            this.messageListRef.current.scrollToBottom();
        }
    }
    @computed
    get shareInProgress(): boolean {
        const chat = chatStore.activeChat;
        if (!chat) return false;
        return (
            (chat.uploadQueue && chat.uploadQueue.length > 0) ||
            (chat.folderShareQueue && chat.folderShareQueue.length > 0)
        );
    }
    /**
     * Create a new Message keg with the given plaintext and send it to server as part of this chat.
     * @param text The plaintext of the message.
     */
    sendMessage(text: string): void {
        try {
            chatStore.activeChat.sendMessage(text).catch(() => playErrorSound());
        } catch (err) {
            console.error(err);
        }
    }
    /**
     * Create a new Message keg with the given plaintext and send it to server as part of this chat.
     * @param richText A ProseMirror document tree, in JSON.
     * @param legacyText The rendered HTML of the rich text, for back-compat with older clients
     */
    @action.bound
    sendRichTextMessage(richText: unknown, legacyText: string): void {
        try {
            this.scrollToBottom();
            chatStore.activeChat
                .sendRichTextMessage(richText, legacyText)
                .catch(() => playErrorSound());
        } catch (err) {
            console.error(err);
        }
    }
    @action.bound
    sendAck(): void {
        try {
            this.scrollToBottom();
            chatStore.activeChat.sendAck().catch(() => playErrorSound());
        } catch (err) {
            console.error(err);
        }
    }
    @action.bound
    shareFilesAndFolders(filesAndFolders) {
        try {
            this.scrollToBottom();
            chatStore.activeChat
                .shareFilesAndFolders(filesAndFolders)
                .catch(() => playErrorSound());
        } catch (err) {
            console.error(err);
        }
    }
    @observable.ref
    messageListRef = React.createRef<MessageList>();
    jumpToBottom = () => {
        const chat = chatStore.activeChat;
        if (chat.canGoDown) {
            chat.reset();
            return;
        }
        this.scrollToBottom();
    };
    @computed
    get pageScrolledUp() {
        return this.messageListRef.current && this.messageListRef.current.pageScrolledUp;
    }
    render() {
        const { connectDropTarget, isBeingDraggedOver, chat } = this.props;
        return connectDropTarget(
            <div
                className={css('messages-container', {
                    'messages-container-droppable-hovered': isBeingDraggedOver
                })}
            >
                {chatStore.chats.length === 0 && !chatStore.loading ? null : (
                    <MessageList ref={this.messageListRef} />
                )}
                {this.shareInProgress ? (
                    <ShareToChatProgress
                        uploadQueue={chat.uploadQueue}
                        folderShareQueue={chat.folderShareQueue}
                    />
                ) : null}
                <MessageInput
                    readonly={!chat || !chat.metaLoaded || chat.isReadOnly}
                    placeholder={
                        chat
                            ? t('title_messageInputPlaceholder', {
                                  chatName: `${chat.isChannel ? '# ' : ''}${chat.name}`
                              })
                            : null
                    }
                    onSend={this.sendRichTextMessage}
                    onAck={this.sendAck}
                    onFileShare={this.shareFilesAndFolders}
                    messageListScrolledUp={this.pageScrolledUp}
                    onJumpToBottom={this.jumpToBottom}
                    shareInProgress={this.shareInProgress}
                />
            </div>
        );
    }
}
