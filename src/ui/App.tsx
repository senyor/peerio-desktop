import React from 'react';
import { observer } from 'mobx-react';

import { Dialog, ProgressBar } from 'peer-ui';
import { clientApp, t } from 'peerio-icebear';

import AppNav from '~/ui/AppNav';
import uiStore from '~/stores/ui-store';
import MigrationDialog from '~/ui/shared-components/MigrationDialog';

@observer
export default class App extends React.Component {
    get signatureErrorDialog() {
        const hide = uiStore.hideFileSignatureErrorDialog;
        const dialogActions = [{ label: t('button_dismiss'), onClick: hide }];
        return (
            <Dialog
                active={uiStore.isFileSignatureErrorDialogActive}
                actions={dialogActions}
                onCancel={hide}
                title={t('title_invalidFileSignature')}
                theme="error"
            >
                <p>{t('error_invalidFileSignatureLong')}</p>
            </Dialog>
        );
    }

    componentWillMount() {
        uiStore.init();
    }

    render() {
        return (
            <div className="app-root">
                <AppNav />
                {clientApp.updatingAfterReconnect ? (
                    <div className="global-update-progress">
                        <ProgressBar />
                    </div>
                ) : null}

                {this.props.children}
                <MigrationDialog />
                {this.signatureErrorDialog}
            </div>
        );
    }
}
