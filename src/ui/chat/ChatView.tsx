import React from 'react';
import { action, observable, reaction, when, IReactionDisposer } from 'mobx';
import { observer } from 'mobx-react';

import { chatStore, chatInviteStore, t, fileStore } from 'peerio-icebear';
import { Contact } from 'peerio-icebear/dist/models';

import config from '~/config';
import routerStore from '~/stores/router-store';
import uiStore from '~/stores/ui-store';
import beaconStore from '~/stores/beacon-store';

import UserPicker from '~/ui/shared-components/UserPicker';
import FullCoverLoader from '~/ui/shared-components/FullCoverLoader';
import ELEMENTS from '~/whitelabel/helpers/elements';
import ZeroChats from '~/whitelabel/components/ZeroChats';
import UploadDialog from '~/ui/shared-components/UploadDialog';

import MessageSideBar from './components/sidebar/MessageSideBar';
import ChatSideBar from './components/sidebar/ChatSideBar';
import ChannelSideBar from './components/sidebar/ChannelSideBar';
import PendingDM from './components/PendingDM';

import ChatHeader from './ChatHeader';
import ChatMainView from './ChatMainView';

@observer
export default class ChatView extends React.Component {
    reactionsToDispose!: IReactionDisposer[];

    @observable.ref filesToShare: string[] | null = null;

    @observable showUserPicker = false;

    componentDidMount() {
        this.reactionsToDispose = [
            reaction(
                () => chatStore.activeChat,
                () => {
                    this.showUserPicker = false;
                }
            ),
            when(
                () =>
                    chatStore.activeChat &&
                    chatStore.activeChat.recentFiles.length === 1 &&
                    fileStore.files.length === 1,
                () => {
                    beaconStore.addBeacons('infoPanel_desktop');
                }
            ),

            // Mark 'pin_desktop' beacon read if user ever pins a chat.
            // Beacon will not show if user unpins all chats and goes back to 0 fav.
            when(
                () => chatStore.activeChat && chatStore.myChats.favorites.length > 0,
                () => {
                    beaconStore.markAsRead('pin_desktop');
                }
            )
        ];

        if (chatInviteStore.activeInvite) {
            routerStore.navigateTo(routerStore.ROUTES.channelInvite);
        }

        ELEMENTS.chatView.checkActiveSpace();

        if (!chatStore.chats.length && !chatInviteStore.received.length) {
            beaconStore.addBeacons('startChat');
        }

        if (
            chatStore.myChats.favorites.length === 0 &&
            chatStore.directMessages.length > config.beacons.dmCountPinPrompt
        ) {
            beaconStore.addBeacons('pin_desktop');
        }
    }

    componentWillUnmount() {
        this.reactionsToDispose.forEach(dispose => dispose());
        beaconStore.clearBeacons();
    }

    @action.bound
    setFilesToShare(files: string[]) {
        this.filesToShare = files;
    }

    @action.bound
    cancelShare() {
        this.filesToShare = null;
    }

    addParticipants = (contacts: Contact[]) => {
        chatStore.activeChat.addParticipants(contacts);
        this.closeUserPicker();
    };

    @action.bound
    openUserPicker() {
        this.showUserPicker = true;
    }

    @action.bound
    closeUserPicker() {
        this.showUserPicker = false;
    }

    @action.bound
    toggleSidebar() {
        uiStore.prefs.chatSideBarIsOpen = !uiStore.prefs.chatSideBarIsOpen;
        uiStore.selectedMessage = null;
    }

    get sidebar() {
        if (!chatStore.activeChat) return null;
        if (uiStore.selectedMessage) {
            return <MessageSideBar />;
        }
        return chatStore.activeChat.isChannel ? (
            <ChannelSideBar
                open={uiStore.prefs.chatSideBarIsOpen}
                onAddParticipants={this.openUserPicker}
            />
        ) : (
            <ChatSideBar open={uiStore.prefs.chatSideBarIsOpen} />
        );
    }

    render() {
        if (!chatStore.chats.length && !chatInviteStore.received.length) {
            return <ZeroChats />;
        }

        const chat = chatStore.activeChat;
        if (!chat) return null;

        if (chat.isInvite) {
            return <PendingDM />;
        }

        return (
            <>
                <div className="message-view">
                    <ChatHeader
                        chat={chat}
                        generateJitsiUrl={chatStore.generateJitsiUrl}
                        toggleSidebar={this.toggleSidebar}
                        sidebarIsOpen={uiStore.prefs.chatSideBarIsOpen}
                    />
                    <div className="messages-and-sidebar-container">
                        {this.showUserPicker ? (
                            <div className="create-new-chat">
                                <UserPicker
                                    className="add-users-to-room"
                                    closeable
                                    onClose={this.closeUserPicker}
                                    onAccept={this.addParticipants}
                                    exceptContacts={chat.allParticipants}
                                    title={t('title_addParticipants')}
                                    noDeleted
                                    context={ELEMENTS.chatView.currentContext}
                                />
                            </div>
                        ) : (
                            <ChatMainView chat={chat} onDropFiles={this.setFilesToShare} />
                        )}
                        {this.sidebar}
                    </div>
                    {chat.leaving ? <FullCoverLoader show /> : null}
                </div>
                {this.filesToShare ? (
                    <UploadDialog deactivate={this.cancelShare} files={this.filesToShare} />
                ) : null}
            </>
        );
    }
}
