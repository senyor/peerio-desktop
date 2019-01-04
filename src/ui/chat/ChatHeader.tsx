import React from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import css from 'classnames';

import { Button, CustomIcon, Dialog, MaterialIcon, ProgressBar, Tooltip } from 'peer-ui';
import { t } from 'peerio-icebear';
import { Chat } from 'peerio-icebear/dist/models';

import ELEMENTS from '~/whitelabel/helpers/elements';
import Beacon from '~/ui/shared-components/Beacon';
import ChatNameEditor from './components/ChatNameEditor';

interface ChatHeaderProps {
    chat: Chat;
    generateJitsiUrl: () => string;
    toggleSidebar: () => void;
    sidebarIsOpen: boolean;
}

@observer
export default class ChatHeader extends React.Component<ChatHeaderProps> {
    @observable chatNameEditorVisible = false;
    showChatNameEditor = () => {
        if (!(this.props.chat.canIAdmin && this.props.chat.isChannel)) return;
        this.chatNameEditorVisible = true;
    };
    hideChatNameEditor = () => {
        this.chatNameEditorVisible = false;
    };

    @observable
    jitsiDialogVisible = false;
    toggleJitsiDialog = () => {
        this.jitsiDialogVisible = !this.jitsiDialogVisible;
    };
    postJitsiLink = () => {
        const jitsiLink = this.props.generateJitsiUrl();
        if (this.props.chat) {
            this.props.chat.createVideoCall(jitsiLink);
        }
        this.toggleJitsiDialog();
    };

    readonly jitsiActions = [
        { label: t('button_cancel'), onClick: this.toggleJitsiDialog },
        { label: t('button_startVideoCall'), onClick: this.postJitsiLink }
    ];

    render() {
        const { chat } = this.props;
        if (!chat) return null;
        const participants = chat.participantUsernames;
        let listMembers = participants[0];
        for (let i = 1; i < participants.length; i++) {
            if (`${listMembers}, ${participants[i]}`.length < 100) {
                listMembers += `, ${participants[i]}`;
            } else {
                listMembers += ' ...';
                break;
            }
        }
        return (
            <>
                <div className="message-toolbar">
                    <div className="message-toolbar-inner">
                        <div className="title" onClick={this.showChatNameEditor}>
                            {this.chatNameEditorVisible ? (
                                <ChatNameEditor
                                    showLabel={false}
                                    className="name-editor"
                                    readOnly={!chat.canIAdmin}
                                    onBlur={this.hideChatNameEditor}
                                    autoFocus
                                />
                            ) : (
                                <div className="name-editor-inner">
                                    {chat.canIAdmin && chat.isChannel ? (
                                        <MaterialIcon icon="edit" />
                                    ) : null}
                                    {chat.isChannel ? (
                                        ELEMENTS.chatView.title(
                                            ELEMENTS.chatEditor.displayName(chat)
                                        )
                                    ) : (
                                        <div className="title-content">{chat.name}</div>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="meta-nav">
                            {chat.isChannel ? (
                                <div className="member-count">
                                    <MaterialIcon
                                        icon="person"
                                        tooltip={listMembers}
                                        tooltipPosition="bottom"
                                    />
                                    {chat.allParticipants.length || ''}
                                </div>
                            ) : chat.changingFavState ? (
                                <ProgressBar circular size="small" />
                            ) : (
                                <div
                                    className={css(
                                        'pin-toggle',
                                        'clickable',
                                        'custom-icon-hover-container'
                                    )}
                                >
                                    <Beacon
                                        name="pin_desktop"
                                        type="spot"
                                        description={t('description_pin_beacon')}
                                        size={40}
                                        onContentClick={chat.toggleFavoriteState}
                                        offsetY={-2}
                                        markReadOnUnmount
                                    >
                                        <Button
                                            onClick={chat.toggleFavoriteState}
                                            theme="small no-hover"
                                        >
                                            <CustomIcon
                                                active={chat.isFavorite}
                                                icon={chat.isFavorite ? 'pin-on' : 'pin-off'}
                                                className="small"
                                                hover={!chat.isFavorite}
                                            />
                                        </Button>
                                    </Beacon>
                                    <Tooltip
                                        text={
                                            chat.isFavorite
                                                ? t('button_unpinChat')
                                                : t('button_pinChat')
                                        }
                                        position="bottom"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="message-toolbar-inner-right">
                        <Button
                            icon="videocam"
                            disabled={!chat || !chat.canSendJitsi}
                            onClick={this.toggleJitsiDialog}
                            tooltip={t('button_startVideoCall')}
                            tooltipPosition="bottom"
                            tooltipSize="small"
                        />
                        <Beacon
                            type="spot"
                            name="infoPanel_desktop"
                            description={t('description_infoPanel_beacon_desktop')}
                            position="right"
                            onContentClick={this.props.toggleSidebar}
                            markReadOnUnmount
                        >
                            <Button
                                icon="chrome_reader_mode"
                                onClick={this.props.toggleSidebar}
                                active={this.props.sidebarIsOpen}
                                tooltip={t('button_toggleSidebar')}
                                tooltipPosition="bottom"
                                tooltipSize="small"
                            />
                        </Beacon>
                    </div>
                </div>
                <Dialog
                    active={this.jitsiDialogVisible}
                    actions={this.jitsiActions}
                    onCancel={this.toggleJitsiDialog}
                    title={t('title_videoCall')}
                >
                    {t('dialog_videoCall')}
                </Dialog>
            </>
        );
    }
}
