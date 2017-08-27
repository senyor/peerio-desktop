const React = require('react');
const { observable } = require('mobx');
const { observer } = require('mobx-react');
const { Button, Switch, TooltipIconButton, ProgressBar, FontIcon, Dialog } = require('~/react-toolbox');
const { User } = require('~/icebear');
const { t } = require('peerio-translator');
const autologin = require('~/helpers/autologin');
const electron = require('electron').remote;
const T = require('~/ui/shared-components/T');
const QR = require('qrcode');
const PDFSaver = require('~/ui/shared-components/PDFSaver');

@observer
class SecuritySettings extends React.Component {
    @observable passphraseVisible = false;
    @observable twoFASecret = null;
    @observable twoFAQRCode = null;
    @observable qrCodeVisible = true; // when false - secret key is visible instead
    @observable totpCode = '';
    @observable totpCodeValidating = false;
    @observable authAppsDialogActive = false;

    componentWillMount() {
        // todo: refresh in 2 hours?
        if (!User.current.twoFAEnabled) {
            this.requestSetup();
        }
    }
    requestSetup = () => {
        User.current.setup2fa().then(secret => {
            this.twoFASecret = secret;
            QR.toDataURL(`otpauth://totp/Peerio:${User.current.username}?secret=${secret}&issuer=Peerio&algorithm=SHA1&digits=6&period=30`, (err, dataUrl) => {
                if (err) console.error(err);
                console.log(dataUrl);
                this.twoFAQRCode = dataUrl;
            });
        });
    }

    togglePassphraseVisibility = () => {
        this.passphraseVisible = !this.passphraseVisible;
    };

    setAccountKeyPDFRef = ref => {
        this.accountKeyPDFRef = ref;
    };

    backupAccountKey = () => {
        const tplVars = {
            username: User.current.username,
            email: User.current.email,
            key: User.current.passphrase
        };

        this.accountKeyPDFRef.save(tplVars, `${User.current.username}.pdf`);
    };

    setTwoFABackupPDFRef = ref => {
        this.twoFABackupPDFRef = ref;
    };

    onToggleAutologin(enable) {
        enable ? autologin.enable() : autologin.disable();
    }

    toggleQRCode = () => {
        this.qrCodeVisible = !this.qrCodeVisible;
        this.totpCodeError = false;
    };

    onTOTPCodeChange = ev => {
        this.totpCode = ev.target.value;
        this.totpCodeError = false;
        if (this.totpCode.replace(/\s+/g, '').length >= 6) {
            this.totpCodeValidating = true;
            User.current.confirm2faSetup(this.totpCode, false)
                .then(backupCodes => {
                    this.backupCodes = backupCodes;
                })
                .catch(() => {
                    this.totpCodeError = true;
                    this.totpCode = '';
                })
                .finally(() => {
                    this.totpCodeValidating = false;
                });
        }
    };

    downloadBackupCodesPDF = () => {
        if (!this.backupCodes) {
            User.current.reissueBackupCodes().then((codes) => {
                this.backupCodes = codes;
                this.downloadBackupCodesPDF();
            });
            return;
        }
        const tplVars = {
            codes: this.backupCodes.join('<br/>')
        };

        this.twoFABackupPDFRef.save(tplVars, `${User.current.username}_2fa.pdf`);
    };

    disable2fa = () => {
        User.current.disable2fa().then(this.requestSetup);
    };
    openAuthApps = () => {
        this.authAppsDialogActive = true;
    };
    closeAuthApps = () => {
        this.authAppsDialogActive = false;
    };
    copyTOTPSecret = () => {
        electron.clipboard.writeText(this.twoFASecret);
    };
    renderAccountKeySection() {
        return (
            <section className="with-bg">
                <div className="title">
                    {t('title_AccountKey')}
                </div>
                <p>
                    {t('title_AKDetail')}
                </p>
                <div className="account-key-toggle">
                    {this.passphraseVisible
                        ? <span className="selectable">{User.current.passphrase}</span>
                        : <span>••••••••••••••••••••••••••••••••••••••••••</span>}&nbsp;&nbsp;
                    <TooltipIconButton icon={this.passphraseVisible ? 'visibility_off' : 'visibility'}
                        tooltip={this.passphraseVisible ?
                            t('title_hideAccountKey') : t('title_showAccountKey')}
                        tooltipPosition="right"
                        tooltipDelay={500}
                        onClick={this.togglePassphraseVisibility} />

                    <Button icon="file_download"
                        label={t('button_saveAccountKey')}
                        style={{ marginLeft: '32px' }}
                        onClick={this.backupAccountKey}
                        primary />
                </div>
                <PDFSaver ref={this.setAccountKeyPDFRef} template="./AccountKeyBackup.html" />

            </section>
        );
    }

    renderAutologinSection() {
        return (
            <section className="with-bg">
                <div className="title">
                    {t('title_securityDeviceSettings')}
                </div>
                <p>
                    {t('title_securityDeviceSettingsDetail')}
                </p>
                <Switch checked={User.current.autologinEnabled}
                    label={t('title_autologinSetting')}
                    onChange={this.onToggleAutologin} />
            </section>
        );
    }

    render2faSetupSection() {
        return (
            <section className="with-bg">
                <T k="title_2FA" className="title" tag="div" />
                <p>
                    <T k="title_2FADetailDesktop" >
                        {{ appsButton: label => <a onClick={this.openAuthApps}>{label}</a> }}
                    </T>
                    <a onClick={this.openAuthApps}><FontIcon value="help" /></a>
                    <Dialog active={this.authAppsDialogActive} title={t('title_authApps')}
                        onOverlayClick={this.closeAuthApps} onEscKeyDown={this.closeAuthApps}
                        actions={[{ label: t('button_dismiss'), onClick: this.closeAuthApps }]}>
                        <div className="text-center"><FontIcon value="file_download" className="dialog-illustration" /></div>
                        <T k="title_authAppsDetails" tag="p" />
                    </Dialog>
                </p>
                <div className="flex-row">
                    <div className="qr-code">
                        <T k="title_step1" className="bold" />
                        {
                            this.twoFAQRCode
                                ? (
                                    this.qrCodeVisible
                                        ? <div>
                                            <T k="title_scanQRCode" tag="div" />
                                            <br />
                                            <img alt={this.twoFASecret} src={this.twoFAQRCode} />
                                            <a onClick={this.toggleQRCode}>
                                                <T k="button_2FAShowSecret" tag="div" className="text-center" />
                                            </a>
                                        </div>
                                        : <div>
                                            <T k="title_pasteTOTPKey" tag="div" />
                                            <br />
                                            <T k="title_2FASecretKey" className="dark-label" tag="div" />

                                            <div className="bold selectable">{this.twoFASecret}
                                                <TooltipIconButton icon="content_copy" onClick={this.copyTOTPSecret}
                                                    tooltip={t('title_copy')} primary /></div>
                                            <br />
                                            <a onClick={this.toggleQRCode}><T k="button_2FAShowQRCode" tag="div" className="text-center" /></a>
                                        </div>
                                )
                                : <ProgressBar type="circular" className="block" />
                        }
                    </div>
                    <div className="totp-code">
                        <T k="title_step2" tag="div" className="bold" />
                        <T k="title_enterTOTPCode" tag="div" />
                        <br />
                        <T k="title_enterTOTPCodeFromApp" tag="div" className="dark-label" />
                        <input type="text" className="totp-input" disabled={!this.twoFASecret || this.totpCodeValidating}
                            value={this.totpCode} onChange={this.onTOTPCodeChange}
                            style={{ backgroundColor: this.totpCodeError ? '#ffaaaa' : 'initial' }} />
                        {this.totpCodeValidating ? <ProgressBar type="circular" className="totp-progress" /> : null}
                    </div>
                </div>
            </section>
        );
    }
    render2faEnabledSection() {
        return (
            <section className="with-bg">
                <T k="title_2FA" className="title" tag="div" />
                <p><FontIcon value="thumb_up" className="large-inline-icon" />&nbsp;&nbsp;<T k="title_2FAEnabledThanks" /></p>
                <T k="title_2FABackupDetail" tag="p" />
                <Button icon="file_download" label={t('button_2FABackupDownload')} onClick={this.downloadBackupCodesPDF} flat />
                <div className="text-right"><Button label={t('button_disable')} flat primary onClick={this.disable2fa} /></div>
                <PDFSaver ref={this.setTwoFABackupPDFRef} template="./TwoFABackupCodes.html" />
            </section>
        );
    }

    render() {
        window.c = this;
        return (
            <div>
                {this.renderAccountKeySection()}
                {User.current.twoFAEnabled ? this.render2faEnabledSection() : this.render2faSetupSection()}
                {this.renderAutologinSection()}
            </div>
        );
    }
}

module.exports = SecuritySettings;
