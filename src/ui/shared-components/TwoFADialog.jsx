const React = require('react');
const { Dialog, Checkbox } = require('~/react-toolbox');
const { observable } = require('mobx');
const { observer } = require('mobx-react');
const { t } = require('peerio-translator');
const { clientApp } = require('~/icebear');
const uiStore = require('~/stores/ui-store');
const { validateCode } = require('~/helpers/2fa');
const appControl = require('~/helpers/app-control');

@observer
class TwoFADialog extends React.Component {
    @observable totpCode = '';

    onTOTPCodeChange = ev => {
        this.totpCode = ev.target.value;
    };

    cancel() {
        if (clientApp.active2FARequest.type === 'login') {
            appControl.signout();
        }
        clientApp.active2FARequest.cancel();
    }

    getTitle(request) {
        if (!request) return '';
        switch (request.type) {
            case 'login': return 'title_2FALoginAuth';
            case 'backupCodes': return 'title_2FABackupCodeAuth';
            case 'disable': return 'title_2FADisableAuth';
            default: return '';
        }
    }

    getPreText(request) {
        if (!request) return '';
        switch (request.type) {
            case 'login': return t('title_2FALoginAuthPreText');
            case 'backupCodes': return t('title_2FABackupCodeAuthPreText');
            case 'disable': return t('title_2FADisableAuthPreText');
            default: return '';
        }
    }

    getPostText(request) {
        if (!request) return '';
        switch (request.type) {
            case 'login': return '';
            case 'backupCodes': return t('title_2FABackupCodeAuthPostText');
            case 'disable': return t('title_2FADisableAuthPostText');
            default: return '';
        }
    }

    setInputRef = (ref) => {
        this.inputRef = ref;
        if (clientApp.active2FARequest) ref.focus();
    }

    onTOTPCodeChange = ev => {
        this.totpCode = ev.target.value;
        this.totpCodeError = false;
        const res = validateCode(this.totpCode);
        if (res.readyToSubmit) {
            this.totpCodeValidating = true;
            clientApp.active2FARequest.submit(this.totpCode, uiStore.prefs.last2FATrustDeviceSetting);
            this.totpCode = '';
        }
    };

    onToggleTrust() {
        uiStore.prefs.last2FATrustDeviceSetting = !uiStore.prefs.last2FATrustDeviceSetting;
    }

    render() {
        const req = clientApp.active2FARequest;
        let actions;
        if (req) {
            actions = [{ label: t('button_cancel'), onClick: this.cancel }];
        }
        return (
            <Dialog
                active={!!req}
                title={t(this.getTitle(req))}
                actions={actions}
                className="twofa-dialog">
                <p>{this.getPreText(req)}</p>
                <br />
                <div className="text-center">
                    <input type="text" className="totp-input" ref={this.setInputRef}
                        value={this.totpCode} onChange={this.onTOTPCodeChange}
                        style={this.totpCodeError ? this.errorStyle : null}
                    />
                </div>
                <br />
                {req && req.type === 'login' ?
                    <Checkbox
                        checked={uiStore.prefs.last2FATrustDeviceSetting}
                        label={t('title_trustThisDevice')}
                        onChange={this.onToggleTrust}
                    /> : null}
                <p>{this.getPostText(req)}</p>
            </Dialog>
        );
    }
}

module.exports = TwoFADialog;
