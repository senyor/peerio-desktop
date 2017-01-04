const React = require('react');
const Avatar = require('~/ui/shared-components/Avatar');
const { observer } = require('mobx-react');
const { time } = require('~/helpers/formatter');
const { sanitizeChatMessage } = require('~/helpers/sanitizer');
const emojione = require('~/static/emoji/emojione.js');
const Autolinker = require('autolinker');
const { fileStore } = require('~/icebear');
const { FontIcon } = require('~/react-toolbox');

const autolinker = new Autolinker({
    urls: {
        schemeMatches: true,
        wwwMatches: true,
        tldMatches: true
    },
    email: true,
    phone: true,
    mention: false,
    hashtag: false,
    stripPrefix: false,
    newWindow: false,
    truncate: 0,
    className: '',
    stripTrailingSlash: false
});

function processMessage(msg) {
    if (msg.processedText != null) return msg.processedText;
    // removes all html except whitelisted
    // closes unclosed tags
    let str = sanitizeChatMessage(msg.text);
    str = emojione.unicodeToImage(str);
    str = autolinker.link(str);
    str = { __html: str };
    msg.processedText = str;
    return str;
}

@observer
class Message extends React.Component {
    render() {
        return (
            <div className="message-content-wrapper">
                <Avatar contact={this.props.message.sender} />
                <div className="message-content">
                    <div className="meta-data">
                        <div className="user">{this.props.message.sender.username}</div>
                        <div className="timestamp">{time.format(this.props.message.timestamp)}</div>
                    </div>
                    <p dangerouslySetInnerHTML={processMessage(this.props.message)} />
                    {this.props.message.files ? <InlineFiles files={this.props.message.files} /> : null}
                </div>
                {this.props.message.sending ? <div className="sending-overlay" /> : null}
            </div>
        );
    }
}

@observer
class InlineFiles extends React.Component {
    goToFiles() {
        window.router.push('/app/files');
    }
    render() {
        // todo: temporary, clean broken kegs
        if (!this.props.files.map) return null;

        return (
            <ul onClick={this.goToFiles} className="inline-files">
                {
                    this.props.files.map(f => {
                        const file = fileStore.getById(f);
                        return <li key={f}><FontIcon value="attach_file" /> {file ? file.name : f}</li>;
                    })
                }
            </ul>
        );
    }
}

module.exports = Message;
