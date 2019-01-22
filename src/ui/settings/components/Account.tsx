import React from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

import { Button, Dialog, Switch } from 'peer-ui';
import { User, t } from 'peerio-icebear';

import { signout } from '~/helpers/app-control';
import T from '~/ui/shared-components/T';

@observer
export default class Account extends React.Component {
    @observable deleteAccountDialogActive = false;

    onPromoSubscriptionChanged = (ev: React.ChangeEvent<HTMLInputElement>) => {
        const { checked } = ev.target;
        User.current.saveSettings(settings => {
            settings.subscribeToPromoEmails = checked;
        });
    };

    onDataCollectionChanged = (ev: React.ChangeEvent<HTMLInputElement>) => {
        const { checked } = ev.target;
        User.current.saveSettings(settings => {
            settings.dataCollection = checked;
        });
    };

    showConfirmDelete = () => {
        this.deleteAccountDialogActive = true;
    };

    hideConfirmDelete = () => {
        this.deleteAccountDialogActive = false;
    };

    onDeleteConfirmed = async () => {
        this.deleteAccountDialogActive = false;
        await User.current.deleteAccount(User.current.username);
        signout();
    };

    render() {
        const dialogActions = [
            { label: t('button_cancel'), onClick: this.hideConfirmDelete },
            { label: t('button_confirm'), onClick: this.onDeleteConfirmed }
        ];
        return (
            <div className="settings-container-account">
                <section className="section-divider">
                    <div className="title">{t('title_promoConsentRequestTitle')}</div>
                    <Switch
                        checked={User.current.settings.subscribeToPromoEmails}
                        label={t('title_promoConsent')}
                        onChange={this.onPromoSubscriptionChanged}
                    />
                </section>
                <section>
                    <div className="title">{t('title_dataPreferences')}</div>
                    <p>{t('title_dataDetail')}</p>
                    <Switch
                        checked={User.current.settings.dataCollection}
                        label={t('title_dataCollectionMessage')}
                        onChange={this.onDataCollectionChanged}
                    />
                </section>
                <section className="delete-account">
                    <Button label={t('button_accountDelete')} onClick={this.showConfirmDelete} />
                </section>
                <Dialog
                    active={this.deleteAccountDialogActive}
                    actions={dialogActions}
                    onCancel={this.hideConfirmDelete}
                    title={t('title_accountDelete')}
                >
                    <T k="title_accountDeleteDescription1" tag="p" />
                    <br />
                    <T k="title_accountDeleteDescription2" tag="p" />
                    <br />
                    <T k="title_accountDeleteDescription3" tag="p" />
                </Dialog>
            </div>
        );
    }
}
