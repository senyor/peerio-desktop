const React = require('react');
const { Button, IconButton } = require('~/react-toolbox');
const { observable } = require('mobx');
const { observer } = require('mobx-react');
const css = require('classnames');

@observer
class MailSidebar extends React.Component {
    @observable sent = true;
    @observable expired = true;

    render() {
        return (
            <div className="mail-side-bar">
                {/* <GhostInfo /> */}
                {/* <MailInfo /> */}
                <p>This passphrase unlocks your message. Only share with intended
                recipients.</p>

                <div>
                    <div className="dark-label">Passphrase</div>
                    <div className="passphrase">
                        noodle fist blames ken shriek
                        <IconButton icon="content_copy" />
                    </div>
                </div>
                { !this.sent ?
                    <p>Your message will expire 3 days after it’s sent.</p>
                    : <div className="sent-info">
                        <div className="read-recipt">
                            <div className="dark-label">Viewed</div>
                            <div>September 3, 2016 at 10:10AM</div>
                        </div>
                        <div className="expire-info flex-col">
                            <div className="dark-label">Expires</div>
                            <div>September 6, 2016 at 7:40AM</div>
                            <Button label={this.expired ? 'destroy?' : 'resend'}
                                    style={{ marginLeft: 'auto', marginTop: '8px' }}
                                    primary />
                        </div>
                    </div>
                  }
            </div>
        );
    }
}

module.exports = MailSidebar;
