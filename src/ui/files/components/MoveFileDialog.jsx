const React = require('react');
const { observable, action, computed, reaction } = require('mobx');
const { observer } = require('mobx-react');
const { t } = require('peerio-translator');
const { Button, Dialog, MaterialIcon } = require('peer-ui');
const { fileStore } = require('peerio-icebear');
const Breadcrumb = require('./Breadcrumb');
const Search = require('~/ui/shared-components/Search');
const css = require('classnames');
const { getFolderByEvent } = require('~/helpers/icebear-dom');
const ShareConfirmDialog = require('./ShareConfirmDialog');

@observer
class MoveFileDialog extends React.Component {
    @observable selectedFolder = null;
    @observable currentFolder = null;

    @computed get legacyFileSelected() {
        return (this.props.file && this.props.file.isLegacy) || fileStore.bulk.hasLegacyObjectsSelected;
    }

    @action.bound toggleShareWarning() {
        this.shareWarningDisabled = !this.shareWarningDisabled;
    }

    componentWillMount() {
        this.currentFolder = this.props.currentFolder;
        this.deleteReaction = reaction(() => this.currentFolder.isDeleted, isDeleted => {
            if (isDeleted) this.currentFolder = fileStore.folderStore.root;
        });
    }

    componentWillUnmount() {
        this.deleteReaction();
    }

    @action.bound selectionChange(ev) {
        this.selectedFolder = getFolderByEvent(ev);
    }

    @action.bound setCurrentFolder(ev) {
        this.currentFolder = getFolderByEvent(ev);
    }

    @action.bound async handleMove() {
        const { file, folder } = this.props;
        const target = this.selectedFolder || this.currentFolder;

        // It should not be possible via UI to move a legacy file to a shared folder
        // If it happens somehow, we'll log an error.
        if (this.legacyFileSelected && target.isShared) {
            console.error('Cannot move legacy files to a shared folder');
            this.hideDialog();
            return;
        }

        if (target.root.isShared) {
            // we hide folder selection dialog immediately to prevent flicker
            this.dialog.hideWithoutAnimation();
            if (!await this.shareConfirmDialog.check()) {
                // if user pressed cancel on confirmation, we show our dialog immediately
                // to prevent flicker again
                this.dialog.showWithoutAnimation();
                return;
            }
        }

        // TODO: needs refactoring
        if (this.props.handleMove) {
            this.props.handleMove(target);
        } else {
            fileStore.bulk.moveOne(file || folder, target);
        }

        this.hideDialog();
    }

    @action.bound hideDialog() {
        this.selectedFolder = null;
        this.currentFolder = fileStore.folderStore.root;
        this.props.onHide();
    }

    @computed get visibleFolders() {
        return fileStore.searchQuery ?
            fileStore.foldersSearchResult
            : this.currentFolder.foldersSortedByName;
    }

    @action.bound handleSearch(query) {
        fileStore.searchQuery = query;
    }

    @action.bound changeCurrentFolder(ev) {
        this.currentFolder = getFolderByEvent(ev);
    }

    getFolderRow = (folder) => {
        if (folder === this.props.folder) return null;

        const hasFolders = folder.folders.length > 0;
        const rowDisabled = folder.isShared && this.legacyFileSelected;

        return (<div
            key={`folder-${folder.id}`}
            data-folderid={folder.id}
            data-storeid={folder.store.id}
            className={css('move-file-row', { disabled: rowDisabled })}>
            <Button
                icon={this.selectedFolder === folder ?
                    'radio_button_checked' : 'radio_button_unchecked'}
                onClick={this.selectionChange}
                theme="small"
                selected={this.selectedFolder === folder}
                disabled={rowDisabled}
            />
            <MaterialIcon icon={folder.isShared ? 'folder_shared' : 'folder'} className="folder-icon" />
            <div className={css('file-info', { clickable: hasFolders && !rowDisabled })}
                onClick={rowDisabled ? null : this.setCurrentFolder}
            >
                <div className={css('file-name', { clickable: hasFolders && !rowDisabled })}>{folder.name}</div>
            </div>
            {hasFolders &&
                <Button
                    onClick={this.setCurrentFolder}
                    icon="keyboard_arrow_right"
                    theme="small"
                    disabled={rowDisabled}
                />
            }
        </div>);
    };

    refShareConfirmDialog = ref => { this.shareConfirmDialog = ref; };

    refDialog = ref => { this.dialog = ref; };

    render() {
        const { visible } = this.props;

        const actions = [
            { label: t('button_cancel'), onClick: this.hideDialog },
            { label: t('button_move'), onClick: this.handleMove }
        ];

        const folders = this.visibleFolders
            .map(this.getFolderRow);

        return (
            <div>
                <ShareConfirmDialog ref={this.refShareConfirmDialog} />
                <Dialog
                    ref={this.refDialog}
                    actions={actions}
                    onCancel={this.hideDialog}
                    active={visible}
                    title={t('title_moveFileTo')}
                    className="move-file-dialog">
                    <Search
                        onChange={this.handleSearch}
                        query={fileStore.searchQuery}
                    />
                    <Breadcrumb
                        currentFolder={this.currentFolder}
                        onSelectFolder={this.changeCurrentFolder}
                        noActions
                    />
                    <div className="move-folders-container">
                        {folders}
                    </div>
                </Dialog>
            </div>
        );
    }
}

module.exports = MoveFileDialog;
