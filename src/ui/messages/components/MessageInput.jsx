/* eslint-disable react/no-multi-comp, no-cond-assign */
const React = require('react');
const { IconMenu, MenuItem, IconButton } = require('~/react-toolbox');
const { observable } = require('mobx');
const { observer } = require('mobx-react');
const ComposeInput = require('../../shared-components/ComposeInput');
const Snackbar = require('~/ui/shared-components/Snackbar');

@observer
class MessageInput extends ComposeInput {

    constructor() {
        super();
        this.returnToSend = true;
    }

    render() {
        if (!this.props.show) return null;
        return (
            <div className="message-input" onDrop={this.preventDrop}>
                <Snackbar location="chat" priority="1" />
                <IconMenu icon="add_circle_outline">
                    <MenuItem value="share" caption="Share from files" onClick={this.showFilePicker} />
                    <MenuItem value="upload" caption="Upload to DM" disabled />
                </IconMenu>
                <div id="messageEditor"
                     ref={this.activateQuill}
                     className="full-width"
                     onFocus={this.hideEmojiPicker} />
                <IconButton icon="mood" onClick={this.toggleEmojiPicker} />
                {this.text === ''
                    ? <IconButton icon="thumb_up" onClick={this.props.onAck} className="color-brand" />
                    : null }

                {this.emojiPickerVisible ? this.cachedPicker : null }
                {this.renderFilePicker()}
            </div>
        );
    }
}
module.exports = MessageInput;
