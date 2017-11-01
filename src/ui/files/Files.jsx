const React = require('react');
const { Button, Dialog, Input } = require('~/react-toolbox');
const { observer } = require('mobx-react');
const { observable, action, when } = require('mobx');
const { fileStore, clientApp } = require('~/icebear');
const Search = require('~/ui/shared-components/Search');
const Breadcrumb = require('./components/Breadcrumb');
const FileLine = require('./components/FileLine');
const FolderLine = require('./components/FolderLine');
const FolderActions = require('./components/FolderActions');
const ZeroScreen = require('./components/ZeroScreen');
const { pickLocalFiles } = require('~/helpers/file');
const { t } = require('peerio-translator');
const { getListOfFiles } = require('~/helpers/file');
const MoveFileDialog = require('./components/MoveFileDialog');

const DEFAULT_RENDERED_ITEMS_COUNT = 15;

@observer
class Files extends React.Component {
    constructor() {
        super();
        this.handleUpload = this.handleUpload.bind(this);
    }

    @observable renderedItemsCount = DEFAULT_RENDERED_ITEMS_COUNT;
    pageSize = DEFAULT_RENDERED_ITEMS_COUNT;
    @observable currentFolder = fileStore.fileFolders.root;

    componentWillMount() {
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
        this.currentFolder = folder.parent;
        fileStore.fileFolders.deleteFolder(folder);
        fileStore.fileFolders.save();
    }

    @observable triggerFolderPopup = false;
    @observable addFolderPopupVisible = false;
    @observable triggerRenameFolderPopup = false;
    @observable renameFolderPopupVisible = false;
    @observable folderName = '';
    @observable folderToRename;
    @observable folderToMove;

    showAddFolderPopup = () => {
        this.triggerFolderPopup = true;
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
        this.triggerFolderPopup = false;
        const { folderName, currentFolder } = this;
        if (folderName && folderName.trim()) {
            fileStore.fileFolders.createFolder(folderName, currentFolder);
            fileStore.fileFolders.save();
        }
        this.folderName = '';
    }

    @action handleRenameFolder = () => {
        this.renameFolderPopupVisible = false;
        this.triggerRenameFolderPopup = null;
        const { folderName, folderToRename } = this;
        folderToRename.name = folderName;
        fileStore.fileFolders.save();
        this.folderName = '';
        this.folderToRename = null;
    }

    onPopupRef = (ref) => {
        if (ref) this.addFolderPopupVisible = true;
    };

    get addFolderPopup() {
        const hide = () => {
            this.addFolderPopupVisible = false;
            this.triggerFolderPopup = false;
        };
        const dialogActions = [
            { label: t('button_cancel'), onClick: hide },
            { label: t('button_create'), onClick: this.handleAddFolder }
        ];
        return (
            <Dialog title={t('button_newFolder')}
                active={this.addFolderPopupVisible} type="small" ref={this.onPopupRef}
                actions={dialogActions}
                onOverlayClick={hide} onEscKeyDown={hide}
                className="add-folder-popup">
                <Input placeholder={t('title_folderName')}
                    value={this.folderName} onChange={this.handleFolderNameChange} />
            </Dialog>);
    }

    get renameFolderPopup() {
        const hide = () => {
            this.renameFolderPopupVisible = false;
            this.triggerRenameFolderPopup = false;
        };
        const dialogActions = [
            { label: t('button_cancel'), onClick: hide },
            { label: t('Rename'), onClick: this.handleRenameFolder }
        ];
        return (
            <Dialog title={t('Rename folder')}
                active={this.addFolderPopupVisible} type="small" ref={this.onPopupRef}
                actions={dialogActions}
                onOverlayClick={hide} onEscKeyDown={hide}
                className="add-folder-popup">
                <Input placeholder={t('title_folderName')}
                    value={this.folderName} onChange={this.handleFolderNameChange} />
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
                    this.currentFolder.moveInto(file);
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
        if (folder !== this.currentFolder) {
            this.renderedItemsCount = DEFAULT_RENDERED_ITEMS_COUNT;
            this.currentFolder = folder;
        }
    };

    render() {
        if (!fileStore.files.length
            && !fileStore.loading) return <ZeroScreen onUpload={this.handleUpload} />;

        const { currentFolder } = this;
        const files = [];
        for (let i = 0; i < this.renderedItemsCount && i < currentFolder.files.length; i++) {
            const f = currentFolder.files[i];
            files.push(<FileLine key={f.fileId} file={f} currentFolder={currentFolder} />);
        }

        const folders = [];
        for (let i = 0; i < currentFolder.folders.length; i++) {
            const f = currentFolder.folders[i];
            folders.push(
                <FolderLine
                    key={f.folderId}
                    folder={f}
                    onMoveFolder={() => this.moveFolder(f)}
                    onRenameFolder={this.showRenameFolderPopup}
                    onDeleteFolder={this.deleteFolder}
                    onChangeFolder={this.changeFolder} />
            );
        }

        this.enqueueCheck();
        return (
            <div className="files">
                <Search onChange={this.handleSearch} query={fileStore.currentFilter} />
                <div className="file-wrapper">
                    <div className="files-header">
                        <Breadcrumb currentFolder={currentFolder} onSelectFolder={this.changeFolder} />
                        {!currentFolder.isRoot &&
                            <FolderActions
                                onMove={() => this.moveFolder(this.currentFolder)}
                                onDelete={() => this.deleteFolder(this.currentFolder)}
                                onRename={() => this.showRenameFolderPopup(this.currentFolder)} />}
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
                                {folders}
                                {files}
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
                {this.triggerFolderPopup && this.addFolderPopup}
                {this.triggerRenameFolderPopup && this.renameFolderPopup}
            </div>
        );
    }
}

module.exports = Files;
