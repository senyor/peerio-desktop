// @ts-check
const fs = require('fs');
const os = require('os');
const path = require('path');

const React = require('react');
const { observable } = require('mobx');
const { observer } = require('mobx-react');

const { t } = require('peerio-translator');
const { fileStore, chatStore } = require('peerio-icebear');
const { TooltipIconMenu, MenuItem, TooltipIconButton } = require('~/react-toolbox');

const FilePicker = require('~/ui/files/components/FilePicker');
const Snackbar = require('~/ui/shared-components/Snackbar');
const { pickLocalFiles } = require('~/helpers/file');

const MessageInputProseMirror = require('./MessageInputProseMirror');

/**
 * @augments {React.Component<{
        readonly : boolean
        placeholder : string
        onSend : (richText : Object, legacyText : string) => void
        onAck : () => void
        onFileShare: (files : any) => void
    }, {}>}
 */
@observer
class MessageInput extends React.Component {
    @observable filePickerActive = false;

    handleUpload = () => {
        const chat = chatStore.activeChat;
        if (!chat) return;
        pickLocalFiles().then(paths => {
            if (!paths || !paths.length) return Promise.resolve();
            return Promise.all(paths.map(i => chat.uploadAndShareFile(i)));
        });
    };

    /**
     * Drag-and-drop is handled by another component higher in the hierarchy,
     * so we use this event handler to ensure drops aren't caught in our input field.
     */
    preventDrop = (e) => {
        e.preventDefault();
        return false;
    };

    handleFilePickerClose = () => {
        this.filePickerActive = false;
    };

    shareFiles = selected => {
        this.props.onFileShare(selected);
        this.handleFilePickerClose();
    };

    showFilePicker = () => {
        fileStore.clearSelection();
        this.filePickerActive = true;
    };

    onPaste = (ev) => {
        const chat = chatStore.activeChat;
        if (!chat) return;
        const { items } = ev.clipboardData;
        for (let i = 0; i < items.length; i++) {
            if (!items[i].type.startsWith('image/')) continue;
            const blob = items[i].getAsFile();
            if (!blob) return;
            ev.preventDefault();
            ev.stopPropagation();
            const reader = new FileReader();
            if (!confirm(t('title_uploadPastedFile'))) break;
            const tmpPath = path.join(os.tmpdir(), `peerio-${Date.now()}.${items[i].type.split('/')[1]}`);

            reader.onloadend = () => {
                const buffer = Buffer.from(reader.result);
                fs.writeFile(tmpPath, buffer, {}, (err) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    chat.uploadAndShareFile(tmpPath, '', true);
                });
            };
            reader.readAsArrayBuffer(blob);
            break;
        }
    }

    renderFilePicker() {
        return (
            <FilePicker
                active={this.filePickerActive}
                onClose={this.handleFilePickerClose}
                onShare={this.shareFiles}
            />
        );
    }

    render() {
        const chat = chatStore.activeChat;
        return (
            <div className="message-input-wrapper" >
                <Snackbar className="snackbar-chat" />
                <div className="message-input" onDrop={this.preventDrop} onPaste={this.onPaste}>
                    <TooltipIconMenu icon="add_circle_outline" tooltip={t('button_shareFilesWithChat')}>
                        <MenuItem value="share" caption={t('title_shareFromFiles')} onClick={this.showFilePicker} />
                        <MenuItem value="upload" caption={t('title_uploadAndShare')} onClick={this.handleUpload} />
                    </TooltipIconMenu>
                    {this.props.readonly
                        ? <div className="message-editor-empty" >&nbsp;</div>
                        : <MessageInputProseMirror
                            placeholder={this.props.placeholder}
                            onSend={this.props.onSend}
                        />
                    }
                    <TooltipIconButton
                        disabled={!chat || !chat.canSendAck}
                        icon="thumb_up"
                        onClick={this.props.onAck}
                        className="color-brand"
                        tooltip={t('button_thumbsUp')}
                    />

                    {this.renderFilePicker()}
                </div>
                {this.props.readonly ? <div className="backdrop" /> : null}
            </div>
        );
    }
}

module.exports = MessageInput;
