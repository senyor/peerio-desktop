const React = require('react');
const { observable, action } = require('mobx');
const { observer } = require('mobx-react');
const T = require('~/ui/shared-components/T');
const { t } = require('peerio-translator');
const { Dialog } = require('~/peer-ui');

/**
 */
@observer
class ConfirmFolderDeleteDialog extends React.Component {
    @observable visible = false;
    folder = null;

    @action.bound show(folder) {
        this.folder = folder;
        this.visible = true;
        return new Promise(resolve => { this.resolve = resolve; });
    }

    @action.bound close() {
        this.visible = false;
        this.resolve(false);
        this.resolve = null;
    }

    @action.bound confirm() {
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

        /* isShared
        ? userIsOwner
            ? 'dialog_deleteSharedFolderText'
            : 'dialog_deleteSharedFolderNonOwnerText'
        : 'dialog_deleteFolderText' */

        return (
            <Dialog
                title={
                    <T k="dialog_deleteFolderTitle">{{ folderName: this.folder.name }}</T>
                }
                active={this.visible}
                actions={dialogActions}
                onCancel={this.close}
                className="delete-folder-popup"
                theme="small warning">
                <T k="dialog_deleteFolderText" />
            </Dialog>
        );
    }
}

module.exports = ConfirmFolderDeleteDialog;
