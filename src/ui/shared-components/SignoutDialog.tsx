import React from 'react';
import { Checkbox, Dialog } from 'peer-ui';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { User, t } from 'peerio-icebear';
import uiStore from '~/stores/ui-store';

interface SignoutDialogProps {
    active?: boolean;
    onHide: () => void;
    onSignout: (untrust: boolean) => void;
}

@observer
export default class SignoutDialog extends React.Component<SignoutDialogProps> {
    @observable untrustDevice = false;

    @action.bound
    onToggleUntrust() {
        this.untrustDevice = !this.untrustDevice;
        uiStore.prefs.last2FATrustDeviceSetting = this.untrustDevice;
    }

    render() {
        const actions = [
            { label: t('button_cancel'), onClick: this.props.onHide },
            {
                label: t('button_logout'),
                onClick: () => this.props.onSignout(this.untrustDevice)
            }
        ];

        return (
            <Dialog
                active={this.props.active}
                actions={actions}
                className="signout-dialog"
                onCancel={this.props.onHide}
                title={t('button_logout')}
                theme="warning"
            >
                {t('title_signOutConfirmKeys')}
                {User.current.trustedDevice ? (
                    <div>
                        <br />
                        <Checkbox
                            checked={this.untrustDevice}
                            label={t('title_stopTrustingThisDevice')}
                            onChange={this.onToggleUntrust}
                        />
                    </div>
                ) : null}
            </Dialog>
        );
    }
}
