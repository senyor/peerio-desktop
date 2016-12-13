const React = require('react');
const Avatar = require('../../shared-components/Avatar');
const { observer } = require('mobx-react');
const { time } = require('../../../helpers/formatter');
const Interweave = require('interweave').default;
const css = require('classnames');

@observer
class Message extends React.Component {
    isJumboji = false;

    afterParse = (arr) => {
        if (this.isJumboji) return arr;
        if (arr.length > 10) return arr;
        for (let i = 0; i < arr.length; i++) {
            if (!arr[i].type || arr[0].type.name !== 'Emoji') {
                return arr;
            }
        }
        this.isJumboji = true;
        setTimeout(this.forceUpdate.bind(this));
        return arr;
    };

    render() {
        return (
            <div className={css('message-content-wrapper', { jumboji: this.isJumboji })}>
                <Avatar contact={this.props.message.sender} />
                <div className="message-content">
                    <div className="meta-data">
                        <div className="user">{this.props.message.sender.username}</div>
                        <div className="timestamp">{time.format(this.props.message.timestamp)}</div>
                    </div>
                    <Interweave tagName="p" className="test" content={this.props.message.text} noHtml
                                onAfterParse={this.afterParse} />
                </div>
                {this.props.message.sending ? <div className="sending-overlay" /> : null}
            </div>
        );
    }
}

module.exports = Message;
