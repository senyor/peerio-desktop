const React = require('react');
const { Button, Dialog, Input } = require('~/react-toolbox');
const { observer } = require('mobx-react');
const { observable } = require('mobx');
const { fileStore, clientApp } = require('~/icebear');
const Search = require('~/ui/shared-components/Search');
const Breadcrumb = require('./components/Breadcrumb');
const FileLine = require('./components/FileLine');
const FileActions = require('./components/FileActions');
const ZeroScreen = require('./components/ZeroScreen');
const { pickLocalFiles } = require('~/helpers/file');
const { t } = require('peerio-translator');
const { getListOfFiles } = require('~/helpers/file');
const MoveFileDialog = require('./components/MoveFileDialog');

@observer
class Files extends React.Component {
    constructor() {
        super();
        this.handleUpload = this.handleUpload.bind(this);
    }

    @observable renderedItemsCount = 15;
    pageSize = 15;

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
    moveFolder = () => {
        this.moveFolderVisible = true;
    }
    hideMoveFolder = () => {
        this.moveFolderVisible = false;
    }

    renameFolder = () => {

    }

    deleteFolder = () => {

    }

    @observable triggerFolderPopup = false;
    @observable addFolderPopupVisible = false;
    @observable folderName = '';

    showAddFolderPopup = () => {
        this.triggerFolderPopup = true;
    }
    handleFolderNameChange = (val) => {
        this.folderName = val;
    }
    handleAddFolder = () => {
        this.addFolderPopupVisible = false;
        this.triggerFolderPopup = false;
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

    handleUpload() {
        pickLocalFiles().then(paths => {
            if (!paths || !paths.length) return;
            const list = getListOfFiles(paths);
            if (!list.success.length) return;
            // don't refactor argument to file.upload forEach has index arg that is interpreted as a file name
            list.success.forEach((path) => fileStore.upload(path));
        });
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

    render() {
        if (!fileStore.files.length
            && !fileStore.loading) return <ZeroScreen onUpload={this.handleUpload} />;

        const files = [];
        for (let i = 0; i < this.renderedItemsCount && i < fileStore.visibleFiles.length; i++) {
            const f = fileStore.visibleFiles[i];
            files.push(<FileLine key={f.fileId} file={f} />);
        }

        // TODO: dummy content below, make 3 fake folders
        const folders = [];
        for (let i = 0; i < this.renderedItemsCount && i < fileStore.visibleFiles.length && i < 3; i++) {
            const f = fileStore.visibleFiles[i];
            folders.push(<FileLine key={f.fileId} file={f} isFolder />);
        } // dummy content

        this.enqueueCheck();
        return (
            <div className="files">
                <Search onChange={this.handleSearch} query={fileStore.currentFilter} />
                <div className="file-wrapper">
                    <div className="files-header">
                        <Breadcrumb folderpath={[
                            ['Folder1', 'path1'],
                            ['Folder2', 'path2'],
                            ['Folder3', 'path3'],
                            ['Folder4', 'path1'],
                            ['Folder5', 'path2']
                        ]} />
                        <FileActions
                            onDownload={this.downloadFolder}
                            moveable onMove={this.moveFolder}
                            renameable onRename={this.renameFolder}
                            deleteable onDelete={this.deleteFolder}
                        />
                        <Button className="button-affirmative inverted"
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
                    // TODO: dummy folderpath, needs to connect to real file paths
                    <MoveFileDialog
                        folderpath={[
                            ['Folder1', 'path1'],
                            ['Folder2', 'path2'],
                            ['Folder3', 'path3'],
                            ['Folder4', 'path1'],
                            ['Folder5', 'path2']
                        ]}
                        visible={this.moveFolderVisible}
                        onHide={this.hideMoveFolder}
                    />
                }
                {this.triggerFolderPopup && this.addFolderPopup}
            </div>
        );
    }
}

module.exports = Files;
