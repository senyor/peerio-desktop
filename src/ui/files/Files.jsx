const React = require('react');
const css = require('classnames');
const { Button, Checkbox, Dialog, Input } = require('~/peer-ui');
const { observer } = require('mobx-react');
const { observable, action, computed } = require('mobx');
const { fileStore, clientApp } = require('peerio-icebear');
const Search = require('~/ui/shared-components/Search');
const Breadcrumb = require('./components/Breadcrumb');
const FileLine = require('./components/FileLine');
const FolderLine = require('./components/FolderLine');
const ZeroScreen = require('./components/ZeroScreen');
const { pickLocalFiles } = require('~/helpers/file');
const T = require('~/ui/shared-components/T');
const { t } = require('peerio-translator');
const { getListOfFiles } = require('~/helpers/file');
const MoveFileDialog = require('./components/MoveFileDialog');
const ShareWithMultipleDialog = require('~/ui/shared-components/ShareWithMultipleDialog');
const { getFolderByEvent, getFileByEvent } = require('~/helpers/icebear-dom');

const DEFAULT_RENDERED_ITEMS_COUNT = 15;

@observer
class Files extends React.Component {
    constructor() {
        super();
        this.handleUpload = this.handleUpload.bind(this);
    }

    @observable renderedItemsCount = DEFAULT_RENDERED_ITEMS_COUNT;
    pageSize = DEFAULT_RENDERED_ITEMS_COUNT;

    componentWillMount() {
        clientApp.isInFilesView = true;
    }

    componentDidMount() {
        window.addEventListener('resize', this.enqueueCheck, false);
    }

    componentWillUnmount() {
        clientApp.isInFilesView = false;
        window.removeEventListener('resize', this.enqueueCheck);
        fileStore.clearFilter();
    }

    handleSearch = val => {
        if (val === '') {
            fileStore.clearFilter();
            return;
        }
        fileStore.filterByName(val);
    };

    @observable moveFolderVisible = false;

    @action.bound moveFolder(ev) {
        const folder = getFolderByEvent(ev);
        this.folderToMove = folder;
        this.moveFolderVisible = true;
    }

    @action.bound hideMoveFolder() {
        this.moveFolderVisible = false;
        this.folderToMove = null;
        fileStore.folderFilter = '';
    }

    @action.bound handleDeleteFolder() {
        if (this.folderToDelete.isShared) {
            console.log('delete shared folder');
            return;
        }

        fileStore.folders.currentFolder = this.folderToDelete.parent;
        fileStore.folders.deleteFolder(this.folderToDelete);
        fileStore.folders.save();
    }

    @action.bound async shareFolder(ev) {
        // IMPORTANT: syntetic events are reused, so cache folder before await
        const folder = getFolderByEvent(ev);
        const contacts = await this.shareWithMultipleDialog.show();
        if (!contacts) return;
        fileStore.folders.shareFolder(folder, contacts);
    }

    @observable triggerAddFolderPopup = false;
    @observable addFolderPopupVisible = false;
    @observable triggerRenameFolderPopup = false;
    @observable renameFolderPopupVisible = false;
    @observable triggerDeleteFolderPopup = false;
    @observable deleteFolderPopupVisible = false;
    @observable folderName = '';
    @observable folderToRename;
    @observable folderToMove;
    @observable folderToDelete;

    @action.bound showAddFolderPopup() {
        this.folderName = '';
        this.triggerAddFolderPopup = true;
    }

    @action.bound showRenameFolderPopup(ev) {
        const folder = getFolderByEvent(ev);
        this.folderName = folder.name;
        this.folderToRename = folder;
        this.triggerRenameFolderPopup = true;
    }

    @action.bound handleFolderNameChange(val) {
        this.folderName = val;
    }

    @action.bound handleAddFolder() {
        this.addFolderPopupVisible = false;
        this.triggerAddFolderPopup = false;
        const { folderName } = this;
        if (folderName && folderName.trim()) {
            fileStore.folders.createFolder(folderName, fileStore.folders.currentFolder);
            fileStore.folders.save();
        }
        this.folderName = '';
    }

    @action.bound handleKeyDownAddFolder(ev) {
        if (ev.key === 'Enter' && this.folderName.trim()) {
            this.handleAddFolder();
        }
    }

    @action.bound handleRenameFolder() {
        this.renameFolderPopupVisible = false;
        this.triggerRenameFolderPopup = null;
        const { folderName, folderToRename } = this;
        this.folderName = '';
        this.folderToRename = null;
        folderToRename.rename(folderName);
        fileStore.folders.save();
    }

    handleKeyDownRenameFolder = (ev) => {
        if (ev.key === 'Enter' && this.folderName.trim()) {
            this.handleRenameFolder();
        }
    }

    @action.bound showDeleteFolderPopup(ev) {
        this.triggerDeleteFolderPopup = true;
        this.folderToDelete = getFolderByEvent(ev);
    }

    onAddPopupRef = (ref) => {
        if (ref) this.addFolderPopupVisible = true;
    };

    onRenamePopupRef = (ref) => {
        if (ref) this.renameFolderPopupVisible = true;
    };

    onDeletePopupRef = (ref) => {
        if (ref) this.deleteFolderPopupVisible = true;
    }

    get addFolderPopup() {
        const hide = () => {
            this.addFolderPopupVisible = false;
            this.triggerAddFolderPopup = false;
        };
        const dialogActions = [
            { label: t('button_cancel'), onClick: hide },
            { label: t('button_create'), disabled: !this.folderName.trim(), onClick: this.handleAddFolder }
        ];
        return (
            <Dialog title={t('button_newFolder')}
                active={this.addFolderPopupVisible} theme="small" ref={this.onAddPopupRef}
                actions={dialogActions}
                onCancel={hide}
                className="add-folder-popup">
                <Input placeholder={t('title_folderName')}
                    value={this.folderName} onChange={this.handleFolderNameChange}
                    onKeyDown={this.handleKeyDownAddFolder}
                    autoFocus
                />
            </Dialog>);
    }

    get renameFolderPopup() {
        const hide = () => {
            this.renameFolderPopupVisible = false;
            this.triggerRenameFolderPopup = false;
        };
        const dialogActions = [
            { label: t('button_cancel'), onClick: hide },
            { label: t('button_rename'), disabled: !this.folderName.trim(), onClick: this.handleRenameFolder }
        ];
        return (
            <Dialog title={t('button_rename')}
                active={this.renameFolderPopupVisible} theme="small" ref={this.onRenamePopupRef}
                actions={dialogActions} onKeyDown={this.keyDownRenameFolder}
                onCancel={hide}
                className="add-folder-popup">
                <Input placeholder={t('title_folderName')}
                    value={this.folderName} onChange={this.handleFolderNameChange}
                    onKeyDown={this.handleKeyDownRenameFolder}
                    autoFocus
                />
            </Dialog>);
    }

    get deleteFolderPopup() {
        const isShared = this.folderToDelete.isShared;

        const hide = () => {
            this.deleteFolderPopupVisible = false;
            this.triggerDeleteFolderPopup = false;
        };

        const deleteClick = () => {
            this.handleDeleteFolder();
            hide();
        };

        const dialogActions = [
            { label: t('button_cancel'), onClick: hide },
            { label: t('button_delete'), onClick: deleteClick }
        ];

        return (
            <Dialog title={isShared ? t('dialog_deleteSharedFolderTitle') : t('dialog_deleteFolderTitle')}
                active={this.deleteFolderPopupVisible} ref={this.onDeletePopupRef}
                actions={dialogActions}
                onCancel={hide}
                className="delete-folder-popup"
                theme={isShared ? 'small warning' : 'small'}
            >
                <T k={isShared ? 'dialog_deleteSharedFolderText' : 'dialog_deleteFolderText'} />
            </Dialog>);
    }

    async handleUpload() {
        const paths = await pickLocalFiles();
        if (!paths || !paths.length) return;
        const list = getListOfFiles(paths);
        if (!list.success.length) return;
        await Promise.all(list.success.map(path => {
            return fileStore.upload(
                path, null, fileStore.folders.currentFolder.isRoot ? null : fileStore.folders.currentFolder.folderId
            );
        }));
    }

    toggleSelectAll = ev => {
        if (ev.target.checked) {
            fileStore.folders.currentFolder.folders.forEach(folder => {
                folder.selected = true;
            });
            fileStore.folders.currentFolder.files.forEach(file => {
                file.selected = true;
            });
        } else {
            fileStore.clearSelection();
        }
    };

    @computed get allAreSelected() {
        const currentFilesAndFoldersCount
            = fileStore.folders.currentFolder.folders.length + fileStore.folders.currentFolder.files.length;

        if (currentFilesAndFoldersCount === 0) return false;

        let count = 0;
        fileStore.folders.currentFolder.folders.forEach(f => {
            if (f.selected) count += 1;
        });

        fileStore.folders.currentFolder.files.forEach(f => {
            if (f.selected) count += 1;
        });

        return count === currentFilesAndFoldersCount;
    }

    // todo: move to icebear
    handleBulkDelete = () => {
        const selected = fileStore.getSelectedFiles();
        const hasSharedFiles = selected.some((f) => f.shared);
        if (!selected.length) return;

        let msg = t('title_confirmRemoveFiles', { count: selected.length });
        if (hasSharedFiles) msg += `\n\n${t('title_confirmRemoveSharedFiles')}`;

        if (confirm(msg)) {
            let i = 0;
            const removeOne = () => {
                const f = selected[i];
                f.remove().then(() => {
                    if (++i >= selected.length) return;
                    setTimeout(removeOne, 250);
                });
            };
            removeOne();
        }
    };

    handleFileShareIntent = () => {
        fileStore.deselectUnshareableFiles();
        if (!fileStore.selectedCount) return;
        window.router.push('/app/sharefiles');
    };

    checkScrollPosition = () => {
        if (!this.container) return;
        if (this.renderedItemsCount >= this.items.length) {
            this.renderedItemsCount = this.items.length;
            return;
        }

        const distanceToBottom = this.container.scrollHeight - this.container.scrollTop - this.container.clientHeight;
        if (distanceToBottom < 250) {
            this.renderedItemsCount += this.pageSize;
        }
    };

    enqueueCheck = () => {
        window.requestAnimationFrame(this.checkScrollPosition);
    };

    setContainerRef = (ref) => {
        this.container = ref;
        this.enqueueCheck();
    }

    @action.bound changeFolder(ev) {
        const folder = getFolderByEvent(ev);
        if (folder !== fileStore.folders.currentFolder) {
            this.renderedItemsCount = DEFAULT_RENDERED_ITEMS_COUNT;
            fileStore.folders.currentFolder = folder;
            fileStore.clearFilter();
            fileStore.clearSelection();
        }
    }

    @computed get items() {
        return fileStore.currentFilter ?
            fileStore.visibleFilesAndFolders
            : fileStore.folders.currentFolder.foldersAndFilesDefaultSorting;
    }

    @computed get selectedCount() {
        return fileStore.getSelectedFiles().length + fileStore.selectedFolders.length;
    }

    get breadCrumbsHeader() {
        const bulkShare = () => {
            console.log('bulk share');
        };

        const bulkButtons = [
            {
                label: t('button_share'),
                materialIcon: 'person_add',
                onClick: bulkShare
            },
            {
                label: t('button_download'),
                materialIcon: 'file_download'
            },
            {
                label: t('button_move'),
                customIcon: 'move'
            },
            {
                label: t('button_delete'),
                materialIcon: 'delete'
            }
        ].map(a => {
            return (
                <Button
                    key={a.label}
                    label={a.label}
                    icon={a.materialIcon}
                    customIcon={a.customIcon}
                    onClick={a.onClick}
                />
            );
        });

        return (
            <div className="files-header" data-folderid={fileStore.folders.currentFolder.folderId}>
                <Breadcrumb currentFolder={fileStore.folders.currentFolder}
                    onSelectFolder={this.changeFolder}
                    onMove={this.moveFolder}
                    onDelete={this.showDeleteFolderPopup}
                    onRename={this.showRenameFolderPopup}
                    bulkSelected={this.selectedCount}
                />
                {this.selectedCount > 0
                    ? <div className="buttons-container bulk-buttons">
                        {bulkButtons}
                    </div>
                    : <div className="buttons-container file-buttons">
                        <Button
                            label={t('button_newFolder')}
                            className="new-folder"
                            onClick={this.showAddFolderPopup}
                            theme="affirmative secondary"
                        />
                        <Button className="button-affirmative"
                            label={t('button_upload')}
                            onClick={this.handleUpload}
                            theme="affirmative"
                        />
                    </div>
                }
            </div>
        );
    }

    get searchResultsHeader() {
        return (
            <div className="files-header">
                <div className="search-results-header">
                    {t('title_searchResults')}
                </div>
            </div>
        );
    }

    toggleSelectFile(ev) {
        const file = getFileByEvent(ev);
        file.selected = !file.selected;
    }

    toggleSelectFolder(ev) {
        const folder = getFolderByEvent(ev);
        folder.selected = !folder.selected;
    }

    refShareWithMultipleDialog = ref => { this.shareWithMultipleDialog = ref; };

    render() {
        if (!fileStore.files.length
            && !fileStore.loading) return <ZeroScreen onUpload={this.handleUpload} />;

        const { currentFolder } = fileStore.folders;
        const items = [];
        const data = this.items;
        for (let i = 0; i < this.renderedItemsCount && i < data.length; i++) {
            const f = data[i];
            items.push(f.isFolder ?
                <FolderLine
                    className={css({ 'share-in-progress': f.shareProgress > 0 })}
                    key={f.folderId}
                    folder={f}
                    moveable={fileStore.folders.root.hasNested}
                    onMoveFolder={this.moveFolder}
                    onRenameFolder={this.showRenameFolderPopup}
                    onDeleteFolder={this.showDeleteFolderPopup}
                    onChangeFolder={this.changeFolder}
                    folderActions
                    folderDetails
                    checkbox={!f.isShared}
                    onToggleSelect={this.toggleSelectFolder}
                    selected={f.selected}
                    shareProgress={f.shareProgress}
                    onShare={this.shareFolder}
                /> :
                <FileLine
                    key={f.fileId}
                    file={f}
                    currentFolder={currentFolder}
                    moveable={fileStore.folders.root.hasNested}
                    fileActions
                    fileDetails
                    checkbox
                    onToggleSelect={this.toggleSelectFile}
                    selected={f.selected}
                />);
        }
        this.enqueueCheck();
        return (
            <div className="files">
                <Search onChange={this.handleSearch} query={fileStore.currentFilter} />
                <div className="file-wrapper">
                    {fileStore.currentFilter ? this.searchResultsHeader : this.breadCrumbsHeader}
                    <div className="file-table-wrapper scrollable"
                        ref={this.setContainerRef}
                        onScroll={this.enqueueCheck}
                    >
                        <div className="file-table-header row">
                            <Checkbox
                                className="file-checkbox"
                                onChange={this.toggleSelectAll}
                                checked={this.allAreSelected}
                            />
                            <div className="file-icon" />{/* blank space for file icon image */}
                            <div className="file-name">{t('title_name')}</div>
                            <div className="file-owner">{t('title_owner')}</div>
                            <div className="file-uploaded text-right">{t('title_uploaded')}</div>
                            <div className="file-size text-right">{t('title_size')}</div>
                            <div className="file-actions" />
                        </div>
                        <div className="file-table-body">
                            {items}
                        </div>
                    </div>
                </div>
                {this.moveFolderVisible &&
                    <MoveFileDialog
                        folder={this.folderToMove}
                        currentFolder={currentFolder.parent || currentFolder}
                        visible={this.moveFolderVisible}
                        onHide={this.hideMoveFolder}
                    />
                }
                {this.triggerAddFolderPopup && this.addFolderPopup}
                {this.triggerRenameFolderPopup && this.renameFolderPopup}
                {this.triggerDeleteFolderPopup && this.deleteFolderPopup}
                <ShareWithMultipleDialog ref={this.refShareWithMultipleDialog} />
            </div>
        );
    }
}

module.exports = Files;
