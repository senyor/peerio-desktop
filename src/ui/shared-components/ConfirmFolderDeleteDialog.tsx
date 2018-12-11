import React from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';

import { t, LocalizationStrings } from 'peerio-icebear';
import { FileFolder } from 'peerio-icebear/dist/models';
import { Dialog } from 'peer-ui';

import T from '~/ui/shared-components/T';

@observer
export default class ConfirmFolderDeleteDialog extends React.Component {
    @observable private visible = false;

    private folder: FileFolder | null = null;
    private resolve: ((result: boolean) => void) | null = null;

    @action.bound
    show(folder: FileFolder) {
        this.folder = folder;
        this.visible = true;
        return new Promise<boolean>(resolve => {
            this.resolve = resolve;
        });
    }

    @action.bound
    close() {
        this.visible = false;
        this.resolve(false);
        this.resolve = null;
    }

    @action.bound
    confirm() {
        this.visible = false;
        this.resolve(true);
        this.resolve = null;
    }

    render() {
        if (!this.visible || !this.folder) return null;
        const dialogActions = [
            { label: t('button_cancel'), onClick: this.close },
            { label: t('button_delete'), onClick: this.confirm }
        ];

        let text: keyof LocalizationStrings = 'dialog_deleteFolderText';

        const { isShared } = this.folder;
        if (isShared) {
            text = 'dialog_deleteSharedFolderNonOwnerText';
        }

        return (
            <Dialog
                title={t('dialog_deleteFolderTitle', { folderName: this.folder.name })}
                active={this.visible}
                actions={dialogActions}
                onCancel={this.close}
                className="delete-folder-popup"
                size="small"
                theme="warning"
            >
                <T k={text} />
            </Dialog>
        );
    }
}
