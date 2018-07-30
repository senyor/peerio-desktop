// @ts-check
const React = require('react');
const css = require('classnames');
const { observer } = require('mobx-react');
const { observable, action, computed, reaction } = require('mobx');
const { DropTarget } = require('react-dnd');
const _ = require('lodash');

const { Button, Checkbox, ProgressBar } = require('peer-ui');
const { fileStore, clientApp } = require('peerio-icebear');
const { t } = require('peerio-translator');

const T = require('~/ui/shared-components/T');
const ConfirmFolderDeleteDialog = require('~/ui/shared-components/ConfirmFolderDeleteDialog');

const DraggableLine = require('./components/DraggableLine');
const ZeroScreen = require('./components/ZeroScreen');
const FilesHeader = require('./components/FilesHeader');
const ShareConfirmDialog = require('./components/ShareConfirmDialog');
const FileStatusWindow = require('./components/FileStatusWindow');

const DragDropTypes = require('./helpers/dragDropTypes');
const { uploadDroppedFiles } = require('./helpers/dragDropHelpers');

const { selectDownloadFolder, pickSavePath } = require('~/helpers/file');
const { handleUpload } = require('./helpers/sharedFileAndFolderActions');

const DEFAULT_RENDERED_ITEMS_COUNT = 15;

/**
 * @augments {React.Component<{
        connectDropTarget?: (el: JSX.Element) => JSX.Element,
        isBeingDraggedOver?: boolean
    }, {}>}
 */
@DropTarget(
    [DragDropTypes.NATIVEFILE],
    {
        drop(props, monitor) {
            if (monitor.didDrop()) return; // drop was already handled by eg. a droppable folder line
            uploadDroppedFiles(
                monitor.getItem().files,
                fileStore.folderStore.currentFolder
            );
        }
    },
    (connect, monitor) => ({
        connectDropTarget: connect.dropTarget(),
        isBeingDraggedOver: monitor.isOver({ shallow: true })
    })
)
@observer
class Files extends React.Component {
    @observable renderedItemsCount = DEFAULT_RENDERED_ITEMS_COUNT;
    pageSize = DEFAULT_RENDERED_ITEMS_COUNT;

    shareConfirmDialogRef = React.createRef();

    componentWillMount() {
        clientApp.isInFilesView = true;
        this.disposers = [
            reaction(
                () => fileStore.folderStore.currentFolder,
                () => {
                    this.renderedItemsCount = DEFAULT_RENDERED_ITEMS_COUNT;
                }
            )
        ];
    }

    componentDidMount() {
        window.addEventListener('resize', this.enqueueCheck, false);
        // icebear will call this function to confirm file deletion
        fileStore.bulk.deleteFilesConfirmator = (files, sharedFiles) => {
            let msg = t('title_confirmRemoveFiles', { count: files.length });
            if (sharedFiles.length)
                msg += `\n\n${t('title_confirmRemoveSharedFiles')}`;
            return confirm(msg);
        };

        // icebear will call this function to select folder for bulk save
        fileStore.bulk.downloadFolderSelector = selectDownloadFolder;

        // icebear will call this function trying to pick a file or folder name which doesn't overwrite existing file
        fileStore.bulk.pickPathSelector = pickSavePath;
    }

    componentWillUnmount() {
        clientApp.isInFilesView = false;
        window.removeEventListener('resize', this.enqueueCheck);
        fileStore.searchQuery = '';
        fileStore.clearSelection();
        // remove icebear hook for sharing selection
        fileStore.bulk.shareWithSelector = null;
        // remove icebear hook for deletion
        fileStore.bulk.deleteFilesConfirmator = null;
        // remove icebear hook for bulk save
        fileStore.bulk.downloadFolderSelector = null;
        fileStore.bulk.pickPathSelector = null;
        this.disposers.forEach(d => d());
    }

    toggleSelectAll = ev => {
        this.items.forEach(item => {
            if (item.isShared) return;
            item.selected = !!ev.target.checked;
        });
    };

    @computed
    get items() {
        return fileStore.searchQuery
            ? fileStore.filesAndFoldersSearchResult
            : fileStore.folderStore.currentFolder.filesAndFoldersDefaultSorting;
    }

    @computed
    get renderedItems() {
        const currentFolder = fileStore.folderStore.currentFolder;

        const renderedItems = [];
        const data = this.items;
        for (let i = 0; i < this.renderedItemsCount && i < data.length; i++) {
            const f = data[i];
            if (
                f.isFolder &&
                currentFolder.isRoot &&
                !currentFolder.isShared &&
                f.convertingToVolume
            )
                continue;
            renderedItems.push(
                <DraggableLine
                    fileOrFolder={f}
                    key={f.id}
                    confirmShare={this.confirmShare}
                />
            );
        }
        return renderedItems;
    }

    @computed
    get allAreSelected() {
        return (
            this.items.length &&
            !this.items.some(i => !i.selected && !i.isShared)
        );
    }

    /**
     * @type {() => Promise<boolean>}
     */
    confirmShare = () => {
        return this.shareConfirmDialogRef.current.check();
    };

    checkScrollPosition = () => {
        if (!this.container) return;
        if (this.renderedItemsCount >= this.items.length) {
            this.renderedItemsCount = this.items.length;
            return;
        }

        const distanceToBottom =
            this.container.scrollHeight -
            this.container.scrollTop -
            this.container.clientHeight;
        if (distanceToBottom < 250) {
            this.renderedItemsCount += this.pageSize;
        }
    };

    enqueueCheck = _.debounce(
        () => {
            window.requestAnimationFrame(this.checkScrollPosition);
        },
        100,
        { leading: true, maxWait: 400 }
    );

    setContainerRef = ref => {
        this.container = ref;
        this.enqueueCheck();
    };

    /*
     * 27/6/18: According to Lucas, folder removal notifications are a
     * work-in-progress, and these are just placeholder variables -- one or both
     * might be removed eventually? `removedFolderNotifVisible` is currently
     * always false, so the notification is never shown. (obvs check for rot
     * when implementing for real, please!)
     */
    @observable removedFolderNotifVisible = false;
    @observable removedFolderNotifToHide = false;

    @action.bound
    dismissRemovedFolderNotif() {
        this.removedFolderNotifToHide = true;

        setTimeout(() => {
            this.removedFolderNotifVisible = false;
        }, 250);
    }

    get removedFolderNotif() {
        return (
            <div
                className={css('removed-folder-notif', {
                    'hide-in-progress': this.removedFolderNotifToHide
                })}
            >
                <T k="title_removedFromFolder">
                    {{ folderName: 'Design files' }}
                </T>
                <Button icon="close" onClick={this.dismissRemovedFolderNotif} />
            </div>
        );
    }

    refConfirmFolderDeleteDialog = ref => {
        fileStore.bulk.deleteFolderConfirmator = ref && ref.show;
    };

    render() {
        if (
            !fileStore.files.length &&
            !fileStore.folderStore.root.folders.length &&
            fileStore.loaded
        )
            return <ZeroScreen onUpload={handleUpload} />;

        const currentFolder = fileStore.folderStore.currentFolder;
        const selectedCount = fileStore.selectedFilesOrFolders.length;

        const { connectDropTarget, isBeingDraggedOver } = this.props;

        this.enqueueCheck();
        return (
            <div className="files">
                <FilesHeader />
                <div className="file-wrapper">
                    <div
                        className="file-table-wrapper scrollable"
                        ref={this.setContainerRef}
                        onScroll={this.enqueueCheck}
                    >
                        <div className="file-table-header row-container">
                            <Checkbox
                                className={css('file-checkbox', {
                                    hide: selectedCount === 0
                                })}
                                onChange={this.toggleSelectAll}
                                checked={this.allAreSelected}
                            />
                            <div className="file-icon" />
                            {/* blank space for file icon image */}
                            <div className="file-name">{t('title_name')}</div>
                            <div className="file-owner">{t('title_owner')}</div>
                            <div className="file-uploaded">
                                {t('title_uploaded')}
                            </div>
                            <div className="file-size">{t('title_size')}</div>
                            <div className="file-actions" />
                        </div>
                        {currentFolder.isRoot &&
                            this.removedFolderNotifVisible &&
                            this.removedFolderNotif}
                        {(currentFolder.convertingToVolume ||
                            currentFolder.convertingFromFolder) && (
                            <div
                                className={css('file-ui-subheader', 'row', {
                                    'volume-in-progress':
                                        currentFolder.convertingFromFolder,
                                    'converting-to-volume':
                                        currentFolder.convertingToVolume
                                })}
                            >
                                <div className="file-checkbox percent-in-progress">
                                    {currentFolder.progressPercentage}
                                </div>

                                <div className="file-share-info">
                                    {currentFolder.convertingFromFolder && (
                                        <T k="title_convertingFolderNameToShared">
                                            {{ folderName: currentFolder.name }}
                                        </T>
                                    )}
                                    {currentFolder.convertingToVolume && (
                                        <span>
                                            <T
                                                k="title_filesInQueue"
                                                tag="span"
                                            />&nbsp;
                                            {/* } (34 <T k="title_filesLeftCount" tag="span" />) */}
                                        </span>
                                    )}
                                </div>
                                <ProgressBar
                                    value={currentFolder.progress}
                                    max={currentFolder.progressMax}
                                />
                            </div>
                        )}
                        {connectDropTarget(
                            <div
                                className={css('drop-zone', {
                                    'drop-zone-droppable-hovered': isBeingDraggedOver
                                })}
                            >
                                <div
                                    className={css('file-table-body', {
                                        'hide-checkboxes': selectedCount === 0
                                    })}
                                >
                                    {this.renderedItems}
                                </div>
                                <div className="file-bottom-filler" />
                            </div>
                        )}
                    </div>
                </div>
                <ShareConfirmDialog ref={this.shareConfirmDialogRef} />
                <ConfirmFolderDeleteDialog
                    ref={this.refConfirmFolderDeleteDialog}
                />
                <FileStatusWindow />
            </div>
        );
    }
}

module.exports = Files;
