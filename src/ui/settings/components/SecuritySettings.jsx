const React = require('react');
const { observable } = require('mobx');
const { observer } = require('mobx-react');
const { Button, Dialog } = require('~/react-toolbox');
const { User } = require('~/icebear');
const { t } = require('peerio-translator');
const PasscodeLock = require('~/ui/shared-components/PasscodeLock');

@observer
class SecuritySettings extends React.Component {

    @observable passphraseDialogOpen = false;
    @observable unlocked = false;

    unlock = () => {
        this.unlocked = true;
    };

    hidePassphraseDialog = () => {
        this.passphraseDialogOpen = false;
        this.unlocked = false;
    };

    showPassphraseDialog = () => {
        this.passphraseDialogOpen = true;
    };

    passphraseDialogActions = [
        { label: 'Ok', onClick: this.hidePassphraseDialog }
    ];

    renderShowPassphraseSection() {
        if (!User.current.passcodeIsSet) return null;
        return (
            <div>
                <div className="title">
                    {t('passphrase')}
                    <Button label={t('button_view')} onClick={this.showPassphraseDialog} flat primary />
                </div>
                <p>
                    {t('description_MasterPassword')}
                </p>
                <Dialog active={this.passphraseDialogOpen} actions={this.passphraseDialogActions}
                            onOverlayClick={this.hidePassphraseDialog} onEscKeyDown={this.hidePassphraseDialog}
                            title={this.unlocked ? t('passphrase') : t('devicePasswordRequired')}>
                    { this.unlocked ?
                        <div>
                            <p>{t('whatIsMasterPassword')}</p>
                            <div style={{ marginTop: '40px', height: '48px' }}>
                                <div className="passphrase headline">{User.current.passphrase}</div>
                            </div>
                        </div>
                       : <PasscodeLock onUnlocked={this.unlock} />}

                </Dialog>
            </div>
        );
    }

    render() {
        return (
            <div>
                <section className="section-divider">
                    <div className="title" >
                        {t('peerioPINForThisDeviceDesktop')}
                        <Button label={t('button_update')} flat primary />
                    </div>
                    <p style={{ marginBottom: '40px' }}>
                        {t('description_DevicePassword')}
                    </p>
                    <div className="title">{t('2fa')}
                        <Button label={t('button_activate')} flat primary />
                    </div>
                    <p>
                        {t('description_2fa')}
                    </p>
                </section>
                <section className="section-divider">
                    <div className="title">{t('QRLogin')}
                        <Button label={t('button_generate')} flat primary />
                    </div>
                    <p style={{ marginBottom: '40px' }}>
                        {t('description_QRLogin')}
                    </p>
                    {this.renderShowPassphraseSection()}
                </section>
                <section>
                    <div className="title"> {t('accessLogs')}
                        <Button label={t('button_view')} flat primary />
                    </div>
                    <p>
                        {t('description_accessLogs')}
                    </p>
                </section>
            </div>
        );
    }
  }

module.exports = SecuritySettings;
