const React = require('react');
const { observable } = require('mobx');
const { observer } = require('mobx-react');
const { Button, Switch, TooltipIconButton } = require('~/react-toolbox');
const { User } = require('~/icebear');
const { t } = require('peerio-translator');
const autologin = require('~/helpers/autologin');
const fs = require('fs');
const electron = require('electron').remote;

@observer
class SecuritySettings extends React.Component {
    @observable passphraseVisible = false;

    togglePassphraseVisibility = () => {
        this.passphraseVisible = !this.passphraseVisible;
    };

    setWebViewRef = (ref) => {
        this.webViewRef = ref;
    }
    // TODO: this is duplicated with SaveNow, FIX IT
    save = () => {
        this.replaceTemplateVars(User.current.username, User.current.email, User.current.passphrase, () => {
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
        this.webViewRef.executeJavaScript(js, true, callback);
    }

    printToPdf = (filePath) => {
        if (!filePath) return;
        this.webViewRef.printToPDF({ printBackground: true, landscape: false }, (er, data) => {
            fs.writeFileSync(filePath, data);
        });
    };


    renderShowPassphraseSection() {
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
                        onClick={this.save}
                        primary />
                </div>

                <webview ref={this.setWebViewRef} src="./AccountKeyBackup.html"
                    style={{ display: 'inline-flex', width: 0, height: 0, flex: '0 1' }} />

            </div>
        );
    }

    onToggleAutologin(enable) {
        enable ? autologin.enable() : autologin.disable();
    }

    render() {
        return (
            <div>
                <section className="section-divider section-account-key">
                    {this.renderShowPassphraseSection()}
                </section>
                <section>
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
            </div>
        );
    }
}

module.exports = SecuritySettings;
