/* eslint-disable react/no-danger */
const React = require('react');
const Avatar = require('~/ui/shared-components/Avatar');
const { observer } = require('mobx-react');
const { time } = require('~/helpers/formatter');
const { sanitizeChatMessage } = require('~/helpers/sanitizer');
const emojione = require('~/static/emoji/emojione.js');
const Autolinker = require('autolinker');
const InlineFiles = require('./InlineFiles');
const css = require('classnames');
const { t } = require('peerio-translator');
const config = require('~/config');
const { Button, FontIcon } = require('~/react-toolbox');
const { isUrlAllowed } = require('~/helpers/url');

const autolinker = new Autolinker({
    urls: {
        schemeMatches: true,
        wwwMatches: true,
        tldMatches: true
    },
    replaceFn(match) {
        return isUrlAllowed(match.getAnchorHref());
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
        const m = this.props.message;
       // console.log('Rendering message ', m.tempId || m.id);
        const invalidSign = m.signatureError === true;

        return (
            <div className={
                css('message-content-wrapper', {
                    'invalid-sign': invalidSign, light: this.props.light })}>
                <div className="flex-row">
                    { this.props.light ? null : <Avatar contact={m.sender} /> }
                    { this.props.light ? <div className="timestamp">{time.format(m.timestamp).split(' ')[0]}</div> : null }
                    <div className="message-content">
                        { this.props.light ? null :
                        <div className="meta-data">
                            <div className="user">{m.sender.username}</div>
                            <div className="timestamp">{time.format(m.timestamp)}</div>
                        </div>
                        }
                        <p dangerouslySetInnerHTML={processMessage(m)} />
                        {m.files && m.files.length ? <InlineFiles files={m.files} /> : null}
                    </div>
                    {invalidSign ? <FontIcon value="error_outline_circle" className="warning-icon" /> : null }
                    {m.receipts ?
                        <div key={`${m.tempId || m.id}receipts`} className="receipt-wrapper">
                            {m.receipts.map(u => <Avatar key={u} username={u} size="tiny" />)}
                        </div> : null}
                </div>
                {invalidSign ?
                    <div className="invalid-sign-warning">
                        <div style={{ marginRight: 'auto' }}>{t('invalidSignWarning')}</div>
                        <Button href={config.supportUrl} label={t('readMore')} flat primary />
                    </div>
                    : null
                }

                {m.sending ? <div className="sending-overlay" /> : null}
            </div>
        );
    }
}

module.exports = Message;
