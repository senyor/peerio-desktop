const React = require('react');
const { observable } = require('mobx');
const { observer } = require('mobx-react');
const { Button, Dialog } = require('~/react-toolbox');
const { User } = require('~/icebear');
const { t } = require('peerio-translator');

@observer
class SecuritySettings extends React.Component {

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
                    <div className="title" >
                        {t('peerioPINForThisDevicedesktop')}
                        <Button label={t('button_update')} flat primary />
                    </div>
                    <p style={{ marginBottom: '40px' }}>
                        {t('desciption_DevicePassword')}
                        {/*
                          Your device password is only used to log in to this device.
                        */}
                    </p>
                    <div className="title">{t('2fa')}
                        <Button label={t('button_activate')} flat primary />
                    </div>
                    <p>
                        {t('desciption_2fa')}
                        {/* An additional layer of account protection. */}
                    </p>
                </section>
                <section className="section-divider">
                    <div className="title">{t('QRLogin')}
                        <Button label={t('button_generate')} flat primary />
                    </div>
                    <p style={{ marginBottom: '40px' }}>
                        {t('desciption_QRLogin')}
                        {/*
                          Generate a single use QR code to log in to other devices.
                        */}
                    </p>

                    <div className="title">{t('passphrase')}
                        <Button label={t('button_view')}
                                onClick={this.showPassphrase} flat primary />
                    </div>
                    <p>
                        {t('desciption_MasterPassword')}
                        {/*
                          Your Master Password is required when logging
                          to a new device and after a clean install.
                        */}
                    </p>
                </section>
                <section>
                    <div className="title"> {t('accessLogs')}
                        <Button label={t('button_view')} flat primary />
                    </div>
                    <p>
                        {t('desciption_accessLogs')}
                        {/*
                          Audit access to your account.<br />
                          3 devices have accessed your account in the last 30 days.
                        */}
                    </p>
                </section>

                <Dialog active={this.passphraseVisible} actions={this.passphraseDialogActions}
                        onOverlayClick={this.hidePassphrase} onEscKeyDown={this.hidePassphrase}>
                    <div className="passphrase headline text-center">{User.current.passphrase}</div>
                </Dialog>
            </div>
        );
    }
  }

module.exports = SecuritySettings;
