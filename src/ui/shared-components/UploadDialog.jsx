const React = require('react');
const { action, computed, observable } = require('mobx');
const { observer } = require('mobx-react');
const { chatStore, fileHelpers, User } = require('peerio-icebear');
const { Button, Dialog } = require('~/peer-ui');
const { Input } = require('~/react-toolbox');
const FileSpriteIcon = require('~/ui/shared-components/FileSpriteIcon');
const BetterInput = require('~/ui/shared-components/BetterInput');
const ShareWithDialog = require('~/ui/shared-components/ShareWithDialog');
const css = require('classnames');
const T = require('~/ui/shared-components/T');
const { t } = require('peerio-translator');

@observer
class UploadDialog extends React.Component {
    /* props:
        deactivate()    function    deactivate this dialog
        files           array       files that are being uploaded
    */
    @action componentWillMount() {
        this.targetChat = chatStore.activeChat;
        this.previewNextFile();
    }

    @observable fileName = '';
    // the chat we are sharing the file into
    @observable targetChat = null;

    // if we selected a contact in our list, we should
    // find an existing chat with them or start a new one
    @observable targetContact = null;

    /**
     * Multiple files may be shared
     */
    // start with -1 because we call previewNextFile on mount
    @observable currentFileIndex = -1;
    @computed get currentFile() {
        if (!this.props.files || this.props.files.length < this.currentFileIndex) return null;
        return this.props.files[this.currentFileIndex];
    }

    @action.bound onFileNameChange(val) {
        this.fileName = val;
    }

    @computed get fileExt() {
        return fileHelpers.getFileExtension(fileHelpers.getFileName(this.currentFile));
    }

    @computed get fileType() {
        return fileHelpers.getFileIconType(this.fileExt);
    }

    @observable messageText = '';

    @action.bound onMessageChange(val) {
        this.messageText = val;
    }

    // Iterate through props.files array when clicking either button (or pressing esc) on dialog
    @action.bound previewNextFile() {
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
    @action.bound showShareWithDialog() {
        this.shareWithVisible = true;
    }

    @action.bound hideShareWithDialog() {
        this.shareWithVisible = false;
    }

    // Dialog actions
    @action.bound cancelUpload() {
        this.previewNextFile();
    }

    @action.bound async uploadAndShare() {
        const { targetContact } = this;
        try {
            if (targetContact) {
                this.targetChat = await chatStore.startChat([targetContact]);
                chatStore.activate(this.targetChat.id);
            }
            this.targetChat.uploadAndShareFile(this.currentFile, this.parsedFileName, null, null, this.messageText);
        } catch (err) {
            console.error(err);
        }
        this.previewNextFile();
    }

    // Check if user manually added filename extension back, remove it if so
    @computed get parsedFileName() {
        let fileToSend = this.fileName;
        if (fileHelpers.getFileExtension(this.fileName) === this.fileExt) {
            fileToSend = fileHelpers.getFileNameWithoutExtension(this.fileName);
        }
        fileToSend = fileToSend.concat(`.${this.fileExt}`);
        return fileToSend;
    }

    @action.bound changeToContact(contact) {
        this.targetContact = contact;
        this.targetChat = null;
    }

    @action.bound changeToChannel(channel) {
        this.targetContact = null;
        this.targetChat = channel;
        chatStore.activate(channel.id);
    }

    @computed get targetTitle() {
        const { targetChat, targetContact } = this;
        if (targetContact) {
            return targetContact.fullNameAndUsername;
        }
        return targetChat.isChannel
            ? `# ${targetChat.name}`
            : `@${targetChat.participantUsernames[0] || User.current.username}`;
    }

    @computed get dialogTitle() {
        return this.props.files.length > 1 ?
            t('title_uploadAndShareCount', { current: (this.currentFileIndex + 1), total: this.props.files.length }) :
            t('title_uploadAndShare');
    }

    render() {
        const uploadActions = [
            { label: t('button_cancel'), onClick: this.cancelUpload },
            { label: t('button_share'), onClick: this.uploadAndShare }
        ];

        if (this.shareWithVisible) {
            return (
                <ShareWithDialog
                    onSelectContact={this.changeToContact}
                    onSelectChannel={this.changeToChannel}
                    deactivate={this.hideShareWithDialog}
                />
            );
        }

        return (
            <Dialog active
                className="upload-dialog"
                actions={uploadActions}
                onCancel={this.cancelUpload}
                title={this.dialogTitle}>
                <div className="upload-dialog-contents">
                    <div className={css('image-or-icon', { 'icon-container': this.fileType !== 'img' })}>
                        { this.fileType === 'img'
                            ? <div className="thumbnail"><img src={this.currentFile} alt="" /></div>
                            : <div className="icon-inner">
                                <FileSpriteIcon type={this.fileType} size="xlarge" />
                                <T k="title_previewUnavailable" tag="div" className="preview-unavailable" />
                            </div>
                        }
                    </div>
                    <div className="info-and-inputs">
                        <BetterInput
                            label={t('title_fileName')}
                            value={this.fileName}
                            onChange={this.onFileNameChange}
                            onAccept={this.onFileNameChange}
                            onFocus={this.hideExt}
                            onBlur={this.showExt}
                        />
                        <div className="share-with">
                            <div className="user-list">
                                <T k="title_shareWith" className="heading" tag="div" />
                                <div className="user-or-room-names">
                                    {this.targetTitle}
                                </div>
                            </div>
                            <Button
                                icon="edit"
                                onClick={this.showShareWithDialog}
                                theme="small"
                            />
                        </div>
                        <Input placeholder={t('title_addCommentOptional')}
                            value={this.messageText}
                            onChange={this.onMessageChange}
                            multiline
                            className="add-a-message"
                        />
                    </div>
                </div>
            </Dialog>
        );
    }
}

module.exports = UploadDialog;
