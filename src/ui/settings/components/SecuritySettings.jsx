const React = require('react');
const { observable } = require('mobx');
const { observer } = require('mobx-react');
const { Button, Dialog, Input } = require('~/react-toolbox');
const { User } = require('~/icebear');
const { t } = require('peerio-translator');
const PasscodeLock = require('~/ui/shared-components/PasscodeLock');

@observer
class SecuritySettings extends React.Component {

    @observable passphraseDialogOpen = false;
    @observable unlocked = false;
    @observable setupTwoFactorDialogOpen = false;
    @observable twoFactorActive = false;
    @observable backupCodesDialogOpen = false;

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

    hideTwoFactorDialog = () => {
        this.setupTwoFactorDialogOpen = false;
        this.deactivateTwoFactor();
    };

    showTwoFactorDialog = () => {
        this.setupTwoFactorDialogOpen = true;
    };

    deactivateTwoFactor = () => {
        // TODO trigger confirm dialog.
        this.twoFactorActive = !this.twoFactorActive;
    }

    twoFactorDialogActions = [
        { label: 'cancel', onClick: this.hideTwoFactorDialog },
        { label: 'confirm', onClick: this.hideTwoFactorDialog }
    ];


    hideBackupCodesDialog = () => {
        this.backupCodesDialogOpen = false;
    };

    showBackupCodesDialog = () => {
        this.backupCodesDialogOpen = true;
    };

    backupCodesDialogActions = [
        { label: 'cancel', onClick: this.hideBackupCodesDialog },
        { label: 'download', onClick: this.hideBackupCodesDialog }
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
                        <Button label={this.twoFactorActive ?
                                t('button_backup_codes') : t('button_activate')}
                                onClick={this.twoFactorActive ?
                                  this.showBackupCodesDialog : this.showTwoFactorDialog}
                                flat primary />
                        { this.twoFactorActive ?
                            <Button label={t('button_deactivate')}
                                      onClick={this.deactivateTwoFactor}
                                      flat primary /> : null }
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
                {/* Technically speaking: do we want 2 dialogs or 1 dialog with steps? */}
                <Dialog active={this.setupTwoFactorDialogOpen} actions={this.twoFactorDialogActions}
                        onOverlayClick={this.hideTwoFactorDialog} onEscKeyDown={this.hideTwoFactorDialog}
                        title={t('2fa')}>
                    <div>
                        <p>{t('setupTwoFactor')}</p>
                        {/* To set up 2FA enter the secret key into your authenticator app */}
                        <div>{t('secretKey')}</div>
                        <div className="flex-row flex-align-center flex-justify-between">
                            <div>I am Jack's secret key</div>
                            <Button label={t('button_copy_key')} />
                        </div>
                        <Input label={t('authenticatorCode')} />
                    </div>
                </Dialog>

                <Dialog active={this.backupCodesDialogOpen} actions={this.backupCodesDialogActions}
                        onOverlayClick={this.hideBackupCodesDialog} onEscKeyDown={this.hideBackupCodesDialog}
                        title={t('backupCodes')}>
                    <div>
                        <p>{t('whatAreBackupCodes')}</p>
                        <div className="flex-col">
                            {/* repeat this */}
                            <div className="backup-row">
                                <strong>123456</strong><strong>123456</strong>
                            </div>
                            <div className="backup-row">
                                <strong>123456</strong><strong>123456</strong>
                            </div>
                            <div className="backup-row">
                                <strong>123456</strong><strong>123456</strong>
                            </div>
                        </div>
                    </div>
                </Dialog>
            </div>
        );
    }
  }

module.exports = SecuritySettings;
