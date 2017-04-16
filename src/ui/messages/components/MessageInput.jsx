/* eslint-disable react/no-multi-comp, no-cond-assign */
const React = require('react');
const { IconMenu, MenuItem, IconButton } = require('~/react-toolbox');
const { observer } = require('mobx-react');
const { fileStore } = require('~/icebear');
const ComposeInput = require('../../shared-components/ComposeInput');
const { chatStore } = require('~/icebear');
const { pickSystemFiles } = require('~/helpers/file');
const { t } = require('peerio-translator');
const Snackbar = require('~/ui/shared-components/Snackbar');

@observer
class MessageInput extends ComposeInput {

    constructor() {
        super();
        this.returnToSend = true;
    }

    handleUpload = () => {
        pickSystemFiles().then(paths => {
            if (!paths || !paths.length) return;
            chatStore.activeChat.uploadAndShareFile(paths[0]);
        });
    };

    showFilePicker = () => {
        fileStore.clearSelection();
        this.filePickerActive = true;
    };

    render() {
        if (!this.props.show) return null;
        return (
            <div className="message-input-wrapper">
                <Snackbar className="snackbar-chat" />
                <div className="message-input" onDrop={this.preventDrop}>
                    <IconMenu icon="add_circle_outline">
                        <MenuItem value="share" caption={t('title_shareFromFiles')} onClick={this.showFilePicker} />
                        <MenuItem value="upload" caption={t('title_uploadAndShare')} onClick={this.handleUpload} />
                    </IconMenu>
                    <div id="messageEditor"
                        ref={this.activateQuill}
                        className="full-width" />
                    <IconButton icon="mood" disabled={this.emojiPickerVisible} onClick={this.showEmojiPicker} />

                    {this.text === ''
                        ? <IconButton disabled={!chatStore.activeChat.canSendAck} icon="thumb_up"
                            onClick={this.props.onAck} className="color-brand" />
                        : null}

                    {this.emojiPickerVisible ? this.cachedPicker : null}
                    {this.renderFilePicker()}
                </div>
            </div>
        );
    }
}
module.exports = MessageInput;
