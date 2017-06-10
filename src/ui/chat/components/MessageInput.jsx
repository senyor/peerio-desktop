/* eslint-disable react/no-multi-comp, no-cond-assign */
const React = require('react');
const { IconMenu, MenuItem, IconButton } = require('~/react-toolbox');
const { observe } = require('mobx');
const { observer } = require('mobx-react');
const { fileStore, chatStore } = require('~/icebear');
const ComposeInput = require('../../shared-components/ComposeInput');
const { pickLocalFiles } = require('~/helpers/file');
const { t } = require('peerio-translator');
const Snackbar = require('~/ui/shared-components/Snackbar');
const uiStore = require('~/stores/ui-store');
const fs = require('fs');
const os = require('os');
const path = require('path');

@observer
class MessageInput extends ComposeInput {

    constructor() {
        super();
        this.returnToSend = true;
    }

    handleUpload = () => {
        pickLocalFiles().then(paths => {
            if (!paths || !paths.length) return;
            chatStore.activeChat.uploadAndShareFile(paths[0]);
        });
    };

    componentDidMount() {
        this.disposer = observe(chatStore, 'activeChat', change => {
            this.backupUnsentMessage(change.oldValue);
            this.restoreUnsentMessage(change.newValue);
        }, true);
    }

    componentWillUnmount() {
        this.backupUnsentMessage(chatStore.activeChat);
        this.disposer();
    }

    showFilePicker = () => {
        fileStore.clearSelection();
        this.filePickerActive = true;
    };

    backupUnsentMessage(chat) {
        try {
            if (!chat || !this.quill) return;
            const delta = this.quill.getContents();
            uiStore.unsentMessages[chat.id] = delta;
        } catch (err) {
            console.error(err);
            // don't care, swallowing errors because don't want to deal with all the mounted/unmounted/created states
        }
    }

    restoreUnsentMessage(chat) {
        try {
            if (!this.quill) return;
            let delta;
            if (!chat || !(delta = uiStore.unsentMessages[chat.id])) {
                this.clearEditor();
                return;
            }
            this.quill.setContents(delta);
        } catch (err) {
            console.error(err);
            // don't care, swallowing errors because don't want to deal with all the mounted/unmounted/created states
        }
    }

    onPaste = (ev) => {
        const items = ev.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
            if (!items[i].type.startsWith('image/')) continue;
            const blob = items[i].getAsFile();
            if (!blob) return;
            ev.preventDefault();
            ev.stopPropagation();
            const reader = new FileReader();
            if (!confirm(t('title_uploadPastedFile'))) break;
            const tmpPath = path.join(os.tmpdir(), `peerio-${Date.now()}.${items[i].type.split('/')[1]}`);

            // eslint-disable-next-line
            reader.onloadend = () => {
                const buffer = new Buffer(reader.result);
                fs.writeFile(tmpPath, buffer, {}, (err) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    chatStore.activeChat.uploadAndShareFile(tmpPath, '', true);
                });
            };
            reader.readAsArrayBuffer(blob);
            break;
        }
    }
    onInputBlur = () => {
        setTimeout(() => { this.suggests = null; });
    }

    renderSuggests() {
        if (!this.suggests || !this.suggests.length) return null;
        let c = 0;
        return (
            <div className="suggests-wrapper" >
                <div className="suggests">
                    {this.suggests ?
                        this.suggests.map(s => {
                            const i = c++;
                            return (
                                <div className={`suggest-item ${i === this.selectedSuggestIndex ? 'selected' : ''}`}
                                    key={s.username}
                                    onMouseDown={() => {
                                        this.selectedSuggestIndex = i;
                                        this.acceptSuggestedString();
                                    }}
                                    onMouseOver={() => {
                                        this.selectedSuggestIndex = i;
                                    }}>
                                    @{s.username} - {s.fullName}
                                </div>
                            );
                        }) : null}
                </div>
            </div>
        );
    }

    render() {
        if (!this.props.show) return null;
        return (
            <div className="message-input-wrapper">
                <Snackbar className="snackbar-chat" />
                {this.renderSuggests()}
                <div className="message-input" onDrop={this.preventDrop} onPaste={this.onPaste}>
                    <IconMenu icon="add_circle_outline">
                        <MenuItem value="share" caption={t('title_shareFromFiles')} onClick={this.showFilePicker} />
                        <MenuItem value="upload" caption={t('title_uploadAndShare')} onClick={this.handleUpload} />
                    </IconMenu>
                    <div id="messageEditor" onBlur={this.onInputBlur}
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
