const React = require('react');
const { observable, autorunAsync } = require('mobx');
const { observer } = require('mobx-react');
const { Button, IconButton, Tooltip, Dialogs } = require('~/react-toolbox');

@observer class SecuritySettings extends React.Component {

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

                    <div className="title">Master password</div>
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
            </div>
        );
    }
  }

module.exports = SecuritySettings;
