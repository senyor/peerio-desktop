const React = require('react');
const { observable, action } = require('mobx');
const { observer } = require('mobx-react');
const T = require('~/ui/shared-components/T');
const { t } = require('peerio-translator');
const { Checkbox, Dialog } = require('~/peer-ui');
const uiStore = require('~/stores/ui-store');

@observer
class ShareConfirmDialog extends React.Component {
    @observable visible = false;
    @observable shareWarningDisabled = false;

    @action.bound check() {
        if (uiStore.prefs.seenMoveToSharedVolumeWarning) return true;
        this.visible = true;
        return new Promise(resolve => { this.resolve = resolve; });
    }

    @action.bound cancel() {
        this.visible = false;
        this.resolve(false);
    }

    @action.bound confirm() {
        this.visible = false;
        if (this.shareWarningDisabled) {
            uiStore.prefs.seenMoveToSharedVolumeWarning = true;
        }
        this.resolve(true);
    }

    @action.bound toggleShareWarning() {
        this.shareWarningDisabled = !this.shareWarningDisabled;
    }

    render() {
        if (!this.visible) return null;

        const shareConfirmActions = [
            { label: t('button_cancel'), onClick: this.cancel },
            { label: t('button_move'), onClick: this.confirm }
        ];

        return (
            <Dialog
                actions={shareConfirmActions}
                onCancel={this.cancel}
                active
                title={t('title_moveToSharedFolder')}
                className="move-file-confirm-share">
                <T k="title_moveToSharedFolderDescription" />
                <div className="share-warning-toggle">
                    <Checkbox
                        checked={this.shareWarningDisabled}
                        onChange={this.toggleShareWarning}
                        label={t('title_dontShowMessageAgain')}
                    />
                </div>
            </Dialog>
        );
    }
}

module.exports = ShareConfirmDialog;
