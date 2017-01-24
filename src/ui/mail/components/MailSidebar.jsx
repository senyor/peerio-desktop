const React = require('react');
const { Button, IconButton } = require('~/react-toolbox');
const { observable } = require('mobx');
const { observer } = require('mobx-react');
const css = require('classnames');
const languageStore = require('~/stores/language-store');
const {PhraseDictionary} = require('~/icebear');
const { t } = require('peerio-translator');


@observer
class MailSidebar extends React.Component {
    //@observable expired = true;
    //@observable passphrase = '';
    //
    //componentWillUpdate() {
    //    this.dict = this.dict || new PhraseDictionary(languageStore.localDictionary);
    //    this.passphrase = this.props.ghost.passphrase ? this.props.ghost.passphrase : this.dict.getPassphrase(5);
    //    this.props.ghost.passphrase = this.passphrase;
    //}

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
                            <div>September 3, 2016 at 10:10AM</div>
                        </div>
                        <div className="expire-info flex-col">
                            <div className="dark-label">Expires</div>
                            <div>{this.props.ghost.expiryDate}</div>
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
