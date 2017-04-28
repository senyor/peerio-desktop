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
const { Button, FontIcon, IconMenu, MenuItem } = require('~/react-toolbox');
const { isUrlAllowed } = require('~/helpers/url');
const urls = require('~/config').translator.urlMap;

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

/**
 * IMPORTANT:
 * MessageList.jsx scroll retention logic relies on root element of this component to have
 * class name 'message-content-wrapper' at the first position in class list
 */
@observer
class Message extends React.Component {
    renderSystemData(m) {
        // !! SECURITY: sanitize if you move this to something that renders dangerouslySetInnerHTML
        if (!m.systemData) return null;
        // eslint-disable-next-line default-case
        switch (m.systemData.action) {
            case 'rename':
                return m.systemData.newName
                    ? <span className="system-message">{t('title_chatRenamed', { name: m.systemData.newName })}</span>
                    : <span className="system-message">{t('title_chatNameRemoved')}</span>;
            case 'create':
                return (
                    <span className="system-message">{t('title_chatCreated')}</span>
                );
        }
        return null;
    }
    render() {
        const m = this.props.message;
        // console.log('Rendering message ', m.tempId || m.id);
        const invalidSign = m.signatureError === true;

        return (
            <div className={
                css('message-content-wrapper', {
                    'invalid-sign': invalidSign, 'send-error': m.sendError, light: this.props.light
                })}>
                <div className="flex-row">
                    {this.props.light ? null : <Avatar contact={m.sender} />}
                    {this.props.light ?
                        <div className="timestamp">{time.format(m.timestamp).split(' ')[0]}</div> : null
                    }
                    <div className="message-content">
                        {
                            this.props.light
                                ? null
                                : <div className="meta-data">
                                    <div className="user">{m.sender.username}</div>
                                    <div className="timestamp">{time.format(m.timestamp)}</div>
                                </div>
                        }
                        <div className="flex-row flex-align-center">
                            <p dangerouslySetInnerHTML={processMessage(m)} />
                            {m.files && m.files.length ? <InlineFiles files={m.files} /> : null}
                            {
                                /* SECURITY: sanitize if you move this to something that renders dangerouslySetInnerHTML */
                                this.renderSystemData(m)
                            }
                            {m.sendError ?
                                <div className="send-error-menu">
                                    <IconMenu icon="error" position="topLeft" menuRipple>
                                        <MenuItem value={t('button_retry')}
                                            caption={t('button_retry')}
                                            onClick={() => m.send()} />
                                        <MenuItem value={t('button_delete')}
                                            caption={t('button_delete')}
                                            onClick={() => this.props.chat.removeMessage(m)} />
                                    </IconMenu>
                                </div>
                                : null
                            }
                        </div>
                        {m.sendError ?
                            <div className="send-error-message">{t('error_messageSendFail')}</div>
                            : null}
                    </div>
                    {invalidSign ? <FontIcon value="error_outline_circle" className="warning-icon" /> : null}
                    {m.receipts ?
                        <div key={`${m.tempId || m.id}receipts`} className="receipt-wrapper">
                            {m.receipts.map(u => <Avatar key={u} username={u} size="tiny" />)}
                        </div> : null}

                </div>
                {invalidSign ?
                    <div className="invalid-sign-warning">
                        <div style={{ marginRight: 'auto' }}>{t('error_invalidMessageSignature')}</div>
                        <Button href={urls.msgSignature} label={t('title_readMore')} flat primary />
                    </div>
                    : null
                }

                {m.sending ? <div className="sending-overlay" /> : null}
            </div>
        );
    }
}

module.exports = Message;
