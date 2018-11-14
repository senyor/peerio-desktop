import React from 'react';
import { action, computed, observable, when, IReactionDisposer } from 'mobx';
import { observer } from 'mobx-react';

import { Checkbox, Dialog, Input } from 'peer-ui';
import { User, clientApp, t } from 'peerio-icebear';
import { TwoFARequest } from 'peerio-icebear/dist/defs/interfaces';

import * as telemetry from '~/telemetry';
import uiStore from '~/stores/ui-store';
import { validateCode } from '~/helpers/2fa';

import { getPassphrase } from '~/helpers/autologin';
import { signout } from '~/helpers/app-control';

@observer
export default class TwoFADialog extends React.Component {
    lastUserReaction!: IReactionDisposer;

    componentWillMount() {
        // For telemetry: listen for "last user" object, check if autologin enabled
        this.lastUserReaction = when(
            () => User != null,
            () => {
                User.getLastAuthenticated()
                    .then(lastUser => {
                        return lastUser ? getPassphrase(lastUser.username) : null;
                    })
                    .then(passphrase => {
                        this.isAutologinEnabled = !!passphrase;
                    })
                    .catch(err => {
                        console.error(err);
                    });
            }
        );
    }

    componentWillUnmount() {
        if (this.lastUserReaction) this.lastUserReaction();
    }

    @observable totpCode = '';
    @observable isAutologinEnabled: boolean | undefined;

    @computed
    get readyToSubmit() {
        return validateCode(this.totpCode).readyToSubmit;
    }

    @action.bound
    onTOTPCodeChange(value) {
        this.totpCode = value;
    }

    @action.bound
    submitCode() {
        clientApp.active2FARequest
            .submit(this.totpCode, uiStore.prefs.last2FATrustDeviceSetting)
            .catch(err => {
                telemetry.login.twoFaFail(this.isAutologinEnabled);
                console.error(err);
            });
        this.totpCode = '';
    }

    handleKeyDown = e => {
        if (this.readyToSubmit && e.key === 'Enter') {
            this.submitCode();
        }
    };

    cancel() {
        if (clientApp.active2FARequest.type === 'login') {
            signout();
        }
        clientApp.active2FARequest.cancel();
    }

    getTitle(request: TwoFARequest) {
        if (!request) return '';
        switch (request.type) {
            case 'login':
                return t('title_2FALoginAuth');
            case 'backupCodes':
                return t('title_2FABackupCodeAuth');
            case 'disable':
                return t('title_2FADisableAuth');
            default:
                return '';
        }
    }

    getPreText(request: TwoFARequest) {
        if (!request) return '';
        switch (request.type) {
            case 'login':
                return t('title_2FALoginAuthPreText');
            case 'backupCodes':
                return t('title_2FABackupCodeAuthPreText');
            case 'disable':
                return t('title_2FADisableAuthPreText');
            default:
                return '';
        }
    }

    getPostText(request: TwoFARequest) {
        if (!request) return '';
        switch (request.type) {
            case 'login':
                return ''; // TODO?
            case 'backupCodes':
                return t('title_2FABackupCodeAuthPostText');
            case 'disable':
                return t('title_2FADisableAuthPostText');
            default:
                return '';
        }
    }

    onToggleTrust() {
        uiStore.prefs.last2FATrustDeviceSetting = !uiStore.prefs.last2FATrustDeviceSetting;
    }

    render() {
        const req = clientApp.active2FARequest;

        let actions;
        if (req) {
            actions = [
                { label: t('button_cancel'), onClick: this.cancel },
                {
                    label: t('button_submit'),
                    onClick: this.submitCode,
                    disabled: !this.readyToSubmit
                }
            ];
        }

        const postText = this.getPostText(req);

        return (
            <Dialog
                active={!!req}
                title={this.getTitle(req)}
                actions={actions}
                className="twofa-dialog"
                // @ts-ignore FIXME
                theme="small"
                headerImage="./static/img/illustrations/2sv.svg"
            >
                {this.getPreText(req) ? <p>{this.getPreText(req)}</p> : null}
                <div className="text-center">
                    <Input
                        className="totp-input"
                        value={this.totpCode}
                        onChange={this.onTOTPCodeChange}
                        onKeyDown={this.handleKeyDown}
                        placeholder={t('title_2FAInputPlaceholder')}
                        autoFocus
                    />
                </div>
                {req && req.type === 'login' ? (
                    <Checkbox
                        checked={uiStore.prefs.last2FATrustDeviceSetting}
                        label={t('title_trustThisDevice')}
                        onChange={this.onToggleTrust}
                    />
                ) : null}
                {postText ? <p>{postText}</p> : null}
            </Dialog>
        );
    }
}
