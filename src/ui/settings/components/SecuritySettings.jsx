const React = require('react');
const { observable } = require('mobx');
const { observer } = require('mobx-react');
const { Button, Switch, TooltipIconButton } = require('~/react-toolbox');
const ValidatedInput = require('~/ui/shared-components/ValidatedInput');
const { User, validation } = require('~/icebear');
const { t } = require('peerio-translator');
const PasscodeLock = require('~/ui/shared-components/PasscodeLock');
const T = require('~/ui/shared-components/T');
const cfg = require('~/config.js');
const autologin = require('~/helpers/autologin');
const fs = require('fs');
const electron = require('electron').remote;

const { validators } = validation; // use common validation from core

@observer
class SecuritySettings extends React.Component {

    @observable passphraseDialogOpen = false;
    @observable unlocked = false;
    @observable setupTwoFactorDialogOpen = false;
    @observable twoFactorActive = false;
    @observable backupCodesDialogOpen = false;
    @observable passphraseVisible = false;

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

    togglePassphraseVisibility = () => {
        this.passphraseVisible = !this.passphraseVisible;
    };


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
    };

    hideBackupCodesDialog = () => {
        this.backupCodesDialogOpen = false;
    };

    showBackupCodesDialog = () => {
        this.backupCodesDialogOpen = true;
    };

    wwref = (ref) => {
        this.webviewref = ref;
    }
    // TODO: this is duplicated with Security settings, FIX IT
    save = () => {
        this.replaceTemplateVars(User.current.username, User.current.primaryAddress, User.current.passphrase, () => {
            const win = electron.getCurrentWindow();
            electron.dialog.showSaveDialog(win, { defaultPath: `${User.current.username}.pdf` }, this.printToPdf);
        });
    };

    replaceTemplateVars(username, email, key, callback) {
        const js = `
            document.getElementById('username').innerHTML = '${username}';
            document.getElementById('email').innerHTML = '${email}';
            document.getElementById('key').innerHTML = '${key}';
            `;
        this.webviewref.executeJavaScript(js, true, callback);
    }

    printToPdf = (filePath) => {
        if (!filePath) return;
        this.webviewref.printToPDF({ printBackground: true, landscape: false }, (er, data) => {
            fs.writeFileSync(filePath, data);
        });
    };


    renderShowPassphraseSection() {
        const passphraseDialogActions = [
            { label: t('button_close'), onClick: this.hidePassphraseDialog }
        ];

        return (
            <div>
                <div className="title">
                    {t('title_AccountKey')}
                </div>
                <p>
                    {t('title_AKDetail')}
                </p>
                <div className="account-key-toggle">
                    {this.passphraseVisible
                        ? User.current.passphrase
                        : <span style={{ fontSize: '300%', lineHeight: '90%' }}>
                            &middot;&middot;&middot;&middot;&middot;&middot;&middot;&middot;&middot;&middot;&middot;&middot;&middot;&middot;&middot;&middot;&middot;&middot;&middot;&middot;&middot;
                        </span>}
                    <TooltipIconButton icon={this.passphraseVisible ? 'visibility_off' : 'visibility'}
                        tooltip={this.passphraseVisible ?
                            t('title_hideAccountKey') : t('title_showAccountKey')}
                        tooltipPosition="right"
                        tooltipDelay={500}
                        onClick={this.togglePassphraseVisibility} />

                    <Button icon="file_download"
                        label={t('button_saveAccountKey')}
                        style={{ marginLeft: '32px' }}
                        onClick={this.save}
                        primary />
                </div>

                <webview ref={this.wwref} src="./AccountKeyBackup.html"
                    style={{ display: 'inline-flex', width: 0, height: 0, flex: '0 1' }} />

                {/* <Dialog active={this.passphraseDialogOpen} actions={passphraseDialogActions}
                    className="no-select" title={this.unlocked ? t('title_AccountKey') : t('title_enterPassword')}
                    onOverlayClick={this.hidePassphraseDialog} onEscKeyDown={this.hidePassphraseDialog}>
                    {this.unlocked ?
                        <div>
                            <p>{t('title_AKDetail2')}</p>
                            <div style={{ marginTop: '40px', height: '48px' }}>
                                <div className="passphrase headline selectable">{User.current.passphrase}</div>
                            </div>
                        </div>
                        : <PasscodeLock onUnlocked={this.unlock} />}

                </Dialog> */}
            </div >
        );
    }

    onToggleAutologin(enable) {
        enable ? autologin.enable() : autologin.disable();
    }

    render() {
        // const backupCodesDialogActions = [
        //     { label: t('button_cancel'), onClick: this.hideBackupCodesDialog },
        //     { label: t('button_save'), onClick: this.hideBackupCodesDialog }
        // ];
        // const twoFactorDialogActions = [
        //     { label: t('button_cancel'), onClick: this.hideTwoFactorDialog },
        //     { label: t('button_enable2FA'), onClick: this.hideTwoFactorDialog }
        // ];

        return (
            <div>
                {/* NOTE: Account key should always be at the top.  */}
                <section className="section-divider">
                    {/* <div className="title">{t('title_QRcode')}
                        <Button label={t('button_showQR')} flat primary />
                    </div>
                    <p style={{ marginBottom: '40px' }}>
                        {t('title_QRcodeDetail')}
                    </p>*/}
                    {this.renderShowPassphraseSection()}
                </section>
                <section className="section-divider">
                    <Switch checked={User.current.autologinEnabled}
                        label={t('title_autologinSetting')}
                        onChange={this.onToggleAutologin} />
                </section>
                {/* <section className="section-divider">
                    <div className="title" >
                        {t('title_devicePassword')}
                        <Button label={t('button_changePassword')} flat primary />
                    </div>
                    <p style={{ marginBottom: '40px' }}>
                        <T k="title_passwordIntro" >
                            {{
                                emphasis: text => <strong>{text}</strong>
                            }}
                        </T>
                    </p>
                    <div className="title">{t('title_2FA')}
                        <Button label={this.twoFactorActive ?
                                t('button_backupCodes') : t('button_enable2FA')}
                                onClick={this.twoFactorActive ?
                                  this.showBackupCodesDialog : this.showTwoFactorDialog}
                                flat primary />
                        { this.twoFactorActive ?
                            <Button label={t('button_disable2FA')}
                                      onClick={this.deactivateTwoFactor}
                                      flat primary /> : null }
                    </div>
                    <p>
                        {t('title_2FADetail', { tfaDetailUrl: text => <a href={cfg.tfaDetailUrl}>{text}</a> })}
                    </p>
                </section> */}

                {/* <section>
                    <div className="title"> {t('title_accountActivity')}
                        <Button label={t('button_showActivity')} flat primary />
                    </div>
                    <p>
                        {t('title_accountActivityDetail')}
                    </p>
                </section>*/}
                {/* Technically speaking: do we want 2 dialogs or 1 dialog with steps? */}
                {/* <Dialog active={this.setupTwoFactorDialogOpen} actions={twoFactorDialogActions}
                        onOverlayClick={this.hideTwoFactorDialog} onEscKeyDown={this.hideTwoFactorDialog}
                        title={t('title_2FASetupDesktop')}>
                    <div>
                        <p>{t('title_2FASetupDesktopDetail')}</p>
                        <div>{t('title_2FASetupDesktopDetail2')}</div>
                        <div className="flex-row flex-align-center flex-justify-between" />
                        <Input label={t('title_2FACode')} />
                    </div>
                </Dialog>

                <Dialog active={this.backupCodesDialogOpen} actions={backupCodesDialogActions}
                        onOverlayClick={this.hideBackupCodesDialog} onEscKeyDown={this.hideBackupCodesDialog}
                        title={t('title_backupCodes')}>
                    <div>
                        <p>{t('title_backupCodesDetail')}</p>
                        <div className="flex-col">
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
                </Dialog> */}
            </div>
        );
    }
}

module.exports = SecuritySettings;
