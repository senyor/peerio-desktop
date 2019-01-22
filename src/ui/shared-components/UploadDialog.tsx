import React from 'react';
import { action, computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import css from 'classnames';

import { chatStore, fileHelpers, contactStore, t } from 'peerio-icebear';
import { Contact, Chat } from 'peerio-icebear/dist/models';
import { Button, Dialog, Input, ProgressBar } from 'peer-ui';

import routerStore from '~/stores/router-store';

import T from '~/ui/shared-components/T';
import FileSpriteIcon from '~/ui/shared-components/FileSpriteIcon';
import ShareWithDialog from '~/ui/shared-components/ShareWithDialog';

interface UploadDialogProps {
    initialTargetContact?: Contact;
    files: string[];
    deactivate: () => void;
}

@observer
export default class UploadDialog extends React.Component<UploadDialogProps> {
    componentWillMount() {
        // not mirrored in componentWillReceiveProps which is kind of un-react-y;
        // refactoring this to lift out targetChat/targetContact could be a TODO
        if (this.props.initialTargetContact) {
            this.targetContact = this.props.initialTargetContact;
        } else {
            this.targetChat = chatStore.activeChat;
        }

        if (this.props.files || this.props.files.length > 0) {
            setTimeout(() => {
                this.previewNextFile();
            });
        }
    }

    componentWillReceiveProps(nextProps: UploadDialogProps) {
        if (
            (!this.props.files || !this.props.files.length) &&
            nextProps.files &&
            nextProps.files.length
        ) {
            setTimeout(() => {
                this.previewNextFile();
            });
        }
    }

    @observable fileName = '';

    // the chat we are sharing the file into
    @observable targetChat: Chat | null = null;

    // if we selected a contact in our list, we should
    // find an existing chat with them or start a new one
    @observable targetContact: Contact | null = null;
    /**
     * Multiple files may be shared
     */
    @observable currentFileIndex = -1;

    @computed
    get currentFile() {
        if (!this.props.files || this.props.files.length <= this.currentFileIndex) return null;
        return this.props.files[this.currentFileIndex];
    }

    /**
     * Returns current file name with a random query string added to
     * prevent Chromium caching.
     */
    @computed
    get currentFileForceNoCache() {
        return `${this.currentFile}?${Math.random()}`;
    }

    @action.bound
    onFileNameChange(val: string) {
        this.fileName = val;
    }

    @computed
    get fileExt() {
        if (!this.currentFile) return '';
        return fileHelpers.getFileExtension(fileHelpers.getFileName(this.currentFile));
    }

    @computed
    get fileType() {
        return fileHelpers.getFileIconType(this.fileExt);
    }

    // "Display" filename can be different from true file name (ext shown on input blur, hidden on focus)
    @observable inputFocused = false;

    @action.bound
    onInputFocus() {
        this.inputFocused = true;
    }

    @action.bound
    onInputBlur() {
        this.inputFocused = false;
    }

    @computed
    get displayFileName() {
        if (this.fileName === '') return '';
        if (this.inputFocused) return this.fileName;
        return `${this.fileName}.${this.fileExt}`;
    }

    @observable messageText = '';

    @action.bound
    onMessageChange(val: string) {
        this.messageText = val;
    }

    // Iterate through props.files array when clicking either button (or pressing esc) on dialog
    @action.bound
    previewNextFile() {
        this.currentFileIndex++;
        const file = this.currentFile;
        if (!file) {
            this.props.deactivate();
            return;
        }
        this.fileName = fileHelpers.getFileNameWithoutExtension(file);
        this.messageText = '';
    }

    // Change the chat(s) target of the upload
    @observable shareWithVisible = false;
    @action.bound
    showShareWithDialog() {
        this.shareWithVisible = true;
    }

    @action.bound
    hideShareWithDialog() {
        this.shareWithVisible = false;
    }

    // Dialog actions
    @action.bound
    cancelUpload() {
        this.previewNextFile();
    }

    @action.bound
    async uploadAndShare() {
        const { targetContact } = this;
        try {
            if (targetContact) {
                this.targetChat = await chatStore.startChat([targetContact]);
            }
            this.targetChat.uploadAndShareFile(
                this.currentFile,
                this.parsedFileName,
                null,
                this.messageText
            );
        } catch (err) {
            console.error(err);
        }

        this.previewNextFile();
        if (this.props.files.length <= this.currentFileIndex) {
            routerStore.navigateTo(routerStore.ROUTES.chats);
        }
    }

    // Check if user manually added filename extension back, remove it if so
    @computed
    get parsedFileName() {
        if (fileHelpers.getFileExtension(this.fileName) === this.fileExt) {
            return this.fileName;
        }
        return this.fileName.concat(`.${this.fileExt}`);
    }

    @action.bound
    changeToContact(contact: Contact) {
        this.targetContact = contact;
        this.targetChat = null;
    }

    @action.bound
    changeToChannel(channel: Chat) {
        this.targetContact = null;
        this.targetChat = channel;
        chatStore.activate(channel.id);
    }

    @computed
    get targetTitle() {
        const { targetChat, targetContact } = this;

        if (!!targetChat && targetChat.isChannel) {
            return (
                <div className="user-or-room-names">
                    <span className="room-name">{`# ${targetChat.name}`}</span>
                </div>
            );
        }

        let contact: Contact;
        if (targetContact) {
            contact = targetContact;
        } else {
            contact = targetChat.otherParticipants[0] || contactStore.currentUser;
        }

        return (
            <div className="user-or-room-names">
                <span className="user-full-name">{contact.fullName}</span>
                &nbsp;
                <span className="user-username">{`@${contact.username}`}</span>
            </div>
        );
    }

    @computed
    get dialogTitle() {
        if (!this.props.files || !this.props.files.length) {
            return t('title_preparingForUpload');
        }

        if (this.props.files.length > 1) {
            return t('title_uploadAndShareCount', {
                current: this.currentFileIndex + 1,
                total: this.props.files.length
            });
        }

        return t('title_uploadAndShare');
    }

    render() {
        const uploadActions = [
            { label: t('button_cancel'), onClick: this.cancelUpload },
            {
                label: t('button_share'),
                onClick: this.uploadAndShare,
                disabled: this.fileName.length === 0
            }
        ];

        if (this.shareWithVisible) {
            return (
                <ShareWithDialog
                    onSelectContact={this.changeToContact}
                    onSelectChannel={this.changeToChannel}
                    deactivate={this.hideShareWithDialog}
                    context="sharefiles"
                />
            );
        }

        const haveFiles = this.props.files && this.props.files.length > 0;

        return (
            <Dialog
                active
                noAnimation
                className="upload-dialog"
                actions={haveFiles ? uploadActions : null}
                onCancel={this.cancelUpload}
                title={this.dialogTitle}
            >
                {!haveFiles ? (
                    <div className="upload-dialog-contents">
                        <ProgressBar />
                    </div>
                ) : (
                    <div className="upload-dialog-contents">
                        <div
                            className={css('image-or-icon', {
                                'icon-container': this.fileType !== 'img'
                            })}
                        >
                            {this.fileType === 'img' ? (
                                <div className="thumbnail">
                                    <img src={this.currentFileForceNoCache} alt="" />
                                </div>
                            ) : (
                                <div className="icon-inner">
                                    <FileSpriteIcon type={this.fileType} size="xlarge" />
                                    <T
                                        k="title_previewUnavailable"
                                        tag="div"
                                        className="preview-unavailable"
                                    />
                                </div>
                            )}
                        </div>
                        <div className="info-and-inputs">
                            <Input
                                label={t('title_fileName')}
                                value={this.displayFileName}
                                onChange={this.onFileNameChange}
                                onFocus={this.onInputFocus}
                                onBlur={this.onInputBlur}
                                noHelperText
                            />
                            <div className="share-with">
                                <div className="user-list">
                                    <T k="title_shareWith" className="label" tag="div" />
                                    {this.targetTitle}
                                </div>
                                <Button
                                    icon="edit"
                                    onClick={this.showShareWithDialog}
                                    theme="small"
                                />
                            </div>
                            <Input
                                placeholder={t('title_addCommentOptional')}
                                value={this.messageText}
                                onChange={this.onMessageChange}
                                multiline
                                className="add-a-message"
                            />
                        </div>
                    </div>
                )}
            </Dialog>
        );
    }
}
