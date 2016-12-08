const React = require('react');
const { IconMenu, MenuItem, Input, IconButton } = require('react-toolbox');
const { observable } = require('mobx');
const { observer } = require('mobx-react');
const { t } = require('peerio-translator');
const Snackbar = require('../../shared-components/Snackbar');
const EmojiPicker = require('emojione-picker');
const snackbarControl = require('../../../helpers/snackbar-control');

@observer
class MessageInput extends React.Component {
    @observable inputIsEmpty = true;
    @observable text = '';
    @observable emojiPickerVisible = false;
    handleTextChange = newVal => {
        this.text = newVal;
        this.inputIsEmpty = !(this.text && this.text.trim().length > 0);
        this.messageInput.refs.wrappedInstance.handleAutoresize();
    };

    handleKeyPress = ev => {
        if (ev.key === 'Enter' && !ev.shiftKey && this.text.trim().length) {
            this.props.onSend(this.text);
            ev.preventDefault();
            this.handleTextChange('');
        }
    };

    setTextareaRef = (input) => {
        this.messageInput = input;
    };

    toggleEmojiPicker = () => {
        this.emojiPickerVisible = !this.emojiPickerVisible;
    };

    hideEmojiPicker = () => {
        this.emojiPickerVisible = false;
    };

    getPicker() {
        if (!this.picker) {
            this.picker = (<EmojiPicker search onChange={this.onEmojiPicked}
                                        emojione={{ imageType: 'png', sprites: true }} />);
        }
        return this.picker;
    }

    onEmojiPicked = (emoji) => {
        this.hideEmojiPicker();
        const pos = this.messageInput.refs.wrappedInstance.refs.input.selectionStart;
        const val = this.text;
        this.text = val.slice(0, pos) + emoji.shortname + val.slice(pos);
        this.messageInput.refs.wrappedInstance.refs.input.focus();
    };

    render() {
        if (!this.props.show) return null;
        return (
            <div className="message-input">
                <Snackbar location="chat" priority="1" />
                <IconMenu icon="add_circle_outline">
                    <MenuItem value="share" caption="Share from files" />
                    <MenuItem value="upload" caption="Upload to DM" />
                </IconMenu>
                <Input multiline value={this.text} placeholder={t('enterYourMessage')}
                       onKeyPress={this.handleKeyPress} onChange={this.handleTextChange}
                       onFocus={this.hideEmojiPicker} ref={this.setTextareaRef} />
                <IconButton icon="mood" onClick={this.toggleEmojiPicker} />

                {this.inputIsEmpty
                    ? <IconButton icon={this.inputIsEmpty ? 'thumb_up' : ''} onClick={this.props.onAck}
                                    className="color-brand" />
                    : null }

                {this.emojiPickerVisible ? this.getPicker() : null }
            </div>
        );
    }
}
module.exports = MessageInput;
