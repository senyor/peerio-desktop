const React = require('react');
const { Button, IconButton } = require('~/react-toolbox');
const { observable } = require('mobx');
const { observer } = require('mobx-react');
const css = require('classnames');
const languageStore = require('~/stores/language-store');
const { PhraseDictionary } = require('~/icebear');
const { t } = require('peerio-translator');


@observer
class MailSidebar extends React.Component {
    render() {
        return (
            <div className="mail-side-bar">
                {/* <GhostInfo /> */}
                {/* <MailInfo /> */}
                <p> This passphrase unlocks your message. Only share with intended
                recipients.</p>

                <div>
                    <div className="dark-label">Passphrase</div>
                    <div className="passphrase">
                        {this.props.ghost.passphrase }
                        <IconButton icon="content_copy" />
                    </div>
                </div>
                { !this.props.ghost.sent ?
                    <p>Your message will expire 3 days after it’s sent.</p>
                    : <div className="sent-info">
                        <div className="read-recipt">
                            <div className="dark-label">Viewed</div>
                            <div>{this.props.ghost.url}</div>
                        </div>
                        <div className="expire-info flex-col">
                            <div className="dark-label">Expires</div>
                            <div>{this.props.ghost.expiryDate.toLocaleString()}</div>
                            {this.props.ghost.sent ? <Button label={t('revoke')}
                                    style={{ marginLeft: 'auto', marginTop: '8px' }}
                                    primary /> : '' }
                        </div>
                    </div>
                  }
            </div>
        );
    }
}

module.exports = MailSidebar;
