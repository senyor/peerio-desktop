const React = require('react');
const { IconMenu, MenuItem, Input, IconButton } = require('react-toolbox');
const { observable } = require('mobx');
const { observer } = require('mobx-react');
const { t } = require('peerio-translator');

@observer
class MessageInput extends React.Component {
    @observable inputIsEmpty = true;
    @observable text = '';

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

    render() {
        return (
            <div className="message-input">
                <IconMenu icon="add_circle_outline">
                    <MenuItem value="share" caption="Share from files" />
                    <MenuItem value="upload" caption="Upload to DM" />
                </IconMenu>
                <Input multiline value={this.text} placeholder={t('enterYourMessage')} onKeyPress={this.handleKeyPress}
                                onChange={this.handleTextChange} ref={this.setTextareaRef} />
                <IconButton icon={this.inputIsEmpty ? 'thumb_up' : 'send'} />
            </div>
        );
    }
}
module.exports = MessageInput;
