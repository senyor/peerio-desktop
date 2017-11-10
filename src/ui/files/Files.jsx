const React = require('react');
const { Button, Dialog, Input } = require('~/react-toolbox');
const { observer } = require('mobx-react');
const { observable, action, when } = require('mobx');
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
            uiStore.currentFolder = fileStore.fileFolders.root;
        }
        clientApp.isInFilesView = true;
    }

    componentDidMount() {
        window.addEventListener('resize', this.enqueueCheck, false);
    }

    componentWillUnmount() {
        clientApp.isInFilesView = false;
        window.removeEventListener('resize', this.enqueueCheck);
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
        if (!confirm(t('title_deleteFolder'))) return;
        uiStore.currentFolder = folder.parent;
        fileStore.fileFolders.deleteFolder(folder);
        fileStore.fileFolders.save();
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
            fileStore.fileFolders.createFolder(folderName, uiStore.currentFolder);
            fileStore.fileFolders.save();
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
        fileStore.fileFolders.save();
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
                />
            </Dialog>);
    }

    async handleUpload() {
        const paths = await pickLocalFiles();
        if (!paths || !paths.length) return;
        const list = getListOfFiles(paths);
        if (!list.success.length) return;
        await Promise.all(list.success.map(path => {
            const file = fileStore.upload(path);
            return new Promise(resolve =>
                when(() => file.fileId, () => {
                    uiStore.currentFolder.moveInto(file);
                    resolve();
                }));
        }));
        fileStore.fileFolders.save();
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
        if (this.renderedItemsCount >= fileStore.visibleFiles.length) {
            this.renderedItemsCount = fileStore.visibleFiles.length;
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
        }
    };

    render() {
        if (!fileStore.files.length
            && !fileStore.loading) return <ZeroScreen onUpload={this.handleUpload} />;

        const { currentFolder } = uiStore;
        const items = [];
        const data = fileStore.currentFilter ? fileStore.visibleFiles : currentFolder.foldersAndFilesDefaultSorting;
        for (let i = 0; i < this.renderedItemsCount && i < data.length; i++) {
            const f = data[i];
            items.push(f.isFolder ?
                <FolderLine
                    key={f.folderId}
                    folder={f}
                    onMoveFolder={() => this.moveFolder(f)}
                    onRenameFolder={this.showRenameFolderPopup}
                    onDeleteFolder={this.deleteFolder}
                    onChangeFolder={this.changeFolder} /> :
                <FileLine key={f.fileId} file={f} currentFolder={currentFolder} />);
        }
        this.enqueueCheck();
        return (
            <div className="files">
                <Search onChange={this.handleSearch} query={fileStore.currentFilter} />
                <div className="file-wrapper">
                    <div className="files-header">
                        <Breadcrumb currentFolder={currentFolder}
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
                    <div className="file-table-wrapper" ref={this.setContainerRef} onScroll={this.enqueueCheck}>
                        <table>
                            <thead>
                                <tr>
                                    <th />{/* blank space for download-in-progress icon */}
                                    <th />{/* blank space for file icon image */}
                                    <th>{t('title_name')}</th>
                                    <th>{t('title_owner')}</th>
                                    {/* <th>{t('title_shareable')}</th> */}
                                    <th className="text-right">{t('title_uploaded')}</th>
                                    <th className="text-right">{t('title_size')}</th>
                                    <th />
                                </tr>
                            </thead>
                            <tbody>
                                {items}
                            </tbody>
                        </table>
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
