const React = require('react');
const { IconMenu, MenuItem, Input, IconButton } = require('react-toolbox');
const { observable } = require('mobx');
const { observer } = require('mobx-react');

@observer
class MessageInput extends React.Component {
    @observable inputIsEmpty = true;
    handleTextChange = newVal => {
        this.inputIsEmpty = !newVal.trim().length;
        this.messageInput.refs.wrappedInstance.handleAutoresize();
    };
    handleKeyPress = ev => {
        if (ev.key === 'Enter' && !ev.shiftKey) {
            console.log('SEND');
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
                <Input multiline type="text" placeholder="Messages Alice" onKeyPress={this.handleKeyPress}
                                onChange={this.handleTextChange} ref={this.setTextareaRef} />
                <IconButton icon={this.inputIsEmpty ? 'thumb_up' : 'send'} />
            </div>
        );
    }
}
module.exports = MessageInput;
