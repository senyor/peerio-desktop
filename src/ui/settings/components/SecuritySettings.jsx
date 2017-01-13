const React = require('react');
const { observable } = require('mobx');
const { observer } = require('mobx-react');
const { Button, Dialog } = require('~/react-toolbox');
const { User } = require('~/icebear');

@observer class SecuritySettings extends React.Component {

    @observable passphraseVisible = false;

    hidePassphrase = () => { this.passphraseVisible = false; };
    passphraseDialogActions = [
        { label: 'Ok', onClick: this.hidePassphrase }
    ];

    showPassphrase= () => {
        this.passphraseVisible = true;
    };

    render() {
        return (
            <div>
                <section className="section-divider">
                    <div className="title" style={{ marginBottom: '40px' }}>Device Password
                        <Button label="update" flat primary />
                    </div>

                    <div className="title">Two factor authentication (2FA)
                        <Button label="activate" flat primary />
                    </div>
                </section>
                <section className="section-divider">
                    <div className="title">QR Login
                        <Button label="generate" flat primary />
                    </div>
                    <p style={{ marginBottom: '40px' }}>Generate a
                    single use QR code to log in to other devices.</p>

                    <div className="title">Master password
                        <Button label="view"
                                onClick={this.showPassphrase} flat primary />
                    </div>
                    <p>Your Master Password is required when logging
                    to a new device and after a clean install.</p>
                </section>
                <section>
                    <div className="title">Access logs
                        <Button label="view" flat primary />
                    </div>
                    <p>Audit access to your account.<br />
                    3 devices have accessed your account in the last 30 days.</p>
                </section>

                <Dialog active={this.passphraseVisible} actions={this.passphraseDialogActions}
                        onOverlayClick={this.hidePassphrase} onEscKeyDown={this.hidePassphrase}>
                    <div className="passphrase-display">{User.current.passphrase}</div>
                </Dialog>
            </div>
        );
    }
  }

module.exports = SecuritySettings;
