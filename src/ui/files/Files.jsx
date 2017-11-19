const React = require('react');
const { Button, Dialog, Input } = require('~/react-toolbox');
const { observer } = require('mobx-react');
const { observable, action, when, computed } = require('mobx');
const { fileStore, clientApp } = require('~/icebear');
const Search = require('~/ui/shared-components/Search');
const Breadcrumb = require('./components/Breadcrumb');
const FileLine = require('./components/FileLine');
const FolderLine = require('./components/FolderLine');
const ZeroScreen = require('./components/ZeroScreen');
const { pickLocalFiles } = require('~/helpers/file');
const { t } = require('peerio-translator');
const { getListOfFiles } = require('~/helpers/file');
const MoveFileDialog = require('./components/MoveFileDialog');
const uiStore = require('../../stores/ui-store');

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
        if (!uiStore.currentFolder) {
            uiStore.currentFolder = fileStore.folders.root;
        }
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

    @action moveFolder = folder => {
        this.folderToMove = folder;
        this.moveFolderVisible = true;
    }

    hideMoveFolder = () => {
        this.moveFolderVisible = false;
        this.folderToMove = null;
    }

    @action deleteFolder = folder => {
        if (!confirm(t('title_deleteFolder', { folderName: folder.name }))) return;
        uiStore.currentFolder = folder.parent;
        fileStore.folders.deleteFolder(folder);
        fileStore.folders.save();
    }

    @observable triggerAddFolderPopup = false;
    @observable addFolderPopupVisible = false;
    @observable triggerRenameFolderPopup = false;
    @observable renameFolderPopupVisible = false;
    @observable folderName = '';
    @observable folderToRename;
    @observable folderToMove;

    showAddFolderPopup = () => {
        this.folderName = '';
        this.triggerAddFolderPopup = true;
    }

    @action showRenameFolderPopup = folder => {
        this.folderName = folder.name;
        this.folderToRename = folder;
        this.triggerRenameFolderPopup = true;
    }

    handleFolderNameChange = (val) => {
        this.folderName = val;
    }

    @action handleAddFolder = () => {
        this.addFolderPopupVisible = false;
        this.triggerAddFolderPopup = false;
        const { folderName } = this;
        if (folderName && folderName.trim()) {
            fileStore.folders.createFolder(folderName, uiStore.currentFolder);
            fileStore.folders.save();
        }
        this.folderName = '';
    }

    handleKeyDownAddFolder = (ev) => {
        if (ev.key === 'Enter' && this.folderName.trim()) {
            this.handleAddFolder();
        }
    }

    @action handleRenameFolder = () => {
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

    onAddPopupRef = (ref) => {
        if (ref) this.addFolderPopupVisible = true;
    };

    onRenamePopupRef = (ref) => {
        if (ref) this.renameFolderPopupVisible = true;
    };

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
                active={this.addFolderPopupVisible} type="small" ref={this.onAddPopupRef}
                actions={dialogActions}
                onOverlayClick={hide} onEscKeyDown={hide}
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
                active={this.renameFolderPopupVisible} type="small" ref={this.onRenamePopupRef}
                actions={dialogActions} onKeyDown={this.keyDownRenameFolder}
                onOverlayClick={hide} onEscKeyDown={hide}
                className="add-folder-popup">
                <Input placeholder={t('title_folderName')}
                    value={this.folderName} onChange={this.handleFolderNameChange}
                    onKeyDown={this.handleKeyDownRenameFolder}
                    autoFocus
                />
            </Dialog>);
    }

    async handleUpload() {
        const paths = await pickLocalFiles();
        if (!paths || !paths.length) return;
        const list = getListOfFiles(paths);
        if (!list.success.length) return;
        await Promise.all(list.success.map(path => {
            const file = fileStore.upload(
                path, null, uiStore.currentFolder.isRoot ? null : uiStore.currentFolder.folderId
            );
            return new Promise(resolve =>
                when(() => file.fileId, () => {
                    uiStore.currentFolder.moveInto(file);
                    resolve();
                }));
        }));
    }

    toggleSelection = val => {
        if (val) {
            fileStore.selectAll();
        } else {
            fileStore.clearSelection();
        }
    };

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

    @action changeFolder = folder => {
        if (folder !== uiStore.currentFolder) {
            this.renderedItemsCount = DEFAULT_RENDERED_ITEMS_COUNT;
            uiStore.currentFolder = folder;
            fileStore.clearFilter();
        }
    };

    @computed get items() {
        return fileStore.currentFilter ?
            fileStore.visibleFilesAndFolders
            : uiStore.currentFolder.foldersAndFilesDefaultSorting;
    }

    get breadCrumbsHeader() {
        return (
            <div className="files-header">
                <Breadcrumb currentFolder={uiStore.currentFolder}
                    onSelectFolder={this.changeFolder}
                    onMove={() => this.moveFolder(uiStore.currentFolder)}
                    onDelete={() => this.deleteFolder(uiStore.currentFolder)}
                    onRename={() => this.showRenameFolderPopup(uiStore.currentFolder)}
                />
                <Button className="button-affirmative inverted new-folder"
                    label={t('button_newFolder')}
                    onClick={this.showAddFolderPopup}
                />
                <Button className="button-affirmative"
                    label={t('button_upload')}
                    onClick={this.handleUpload}
                />
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

    render() {
        if (!fileStore.files.length
            && !fileStore.loading) return <ZeroScreen onUpload={this.handleUpload} />;

        const { currentFolder } = uiStore;
        const items = [];
        const data = this.items;
        for (let i = 0; i < this.renderedItemsCount && i < data.length; i++) {
            const f = data[i];
            items.push(f.isFolder ?
                <FolderLine
                    key={f.folderId}
                    folder={f}
                    onMoveFolder={() => this.moveFolder(f)}
                    onRenameFolder={this.showRenameFolderPopup}
                    onDeleteFolder={this.deleteFolder}
                    onChangeFolder={this.changeFolder}
                    folderActions
                    folderDetails
                /> :
                <FileLine
                    key={f.fileId}
                    file={f}
                    currentFolder={currentFolder}
                    fileActions
                    fileDetails
                />);
        }
        this.enqueueCheck();
        return (
            <div className="files">
                <Search onChange={this.handleSearch} query={fileStore.currentFilter} />
                <div className="file-wrapper">
                    {fileStore.currentFilter ? this.searchResultsHeader : this.breadCrumbsHeader}
                    <div className="file-table-wrapper" ref={this.setContainerRef} onScroll={this.enqueueCheck}>
                        <div className="file-table-header row">
                            <div className="loading-icon" />{/* blank space for download-in-progress icon */}
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
            </div>
        );
    }
}

module.exports = Files;
