// @ts-check
const React = require('react');
const { observer } = require('mobx-react');
const { action, computed } = require('mobx');
const { Button } = require('peer-ui');
const { fileStore, chatStore, volumeStore } = require('peerio-icebear');
const { t } = require('peerio-translator');

const config = require('~/config');

const Search = require('~/ui/shared-components/Search');

const AddOrRenameDialog = require('./AddOrRenameDialog');
const ShareWithMultipleDialog = require('~/ui/shared-components/ShareWithMultipleDialog');
const MoveFileDialog = require('./MoveFileDialog');

const Breadcrumb = require('./Breadcrumb');
const { setCurrentFolder, handleUpload, handleSearch } = require('../helpers/sharedFileAndFolderActions');

/**
 * @typedef {'sharefiles' | 'sharefolders' | ''} ShareContext
 */

/**
 * @augments {React.Component<{}, {}>}
 */
@observer
class FilesHeader extends React.Component {
    addFolderDialogRef = React.createRef();
    moveFileDialogRef = React.createRef();
    shareWithMultipleDialogRef = React.createRef();

    showAddFolder = () => {
        this.addFolderDialogRef.current.show();
    }

    showMoveFiles = () => {
        this.moveFileDialogRef.current.show(fileStore.folderStore.currentFolder);
    }

    @action.bound async shareSelected() {
        /** @type {ShareContext} */
        let context;
        if (fileStore.selectedFolders.length > 0) {
            context = 'sharefiles';
        } else if (fileStore.selectedFiles.length > 0) {
            context = 'sharefolders';
        } else {
            context = '';
        }

        const contacts = await this.shareWithMultipleDialogRef.current.show(null, context);
        if (!contacts || !contacts.length) return;

        contacts.forEach(c => chatStore.startChatAndShareFiles([c], fileStore.selectedFiles.slice()));
        fileStore.selectedFolders.forEach(f => f.canShare && volumeStore.shareFolder(f, contacts));
        fileStore.clearSelection();
    }

    @computed get bulkActionButtons() {
        /** @type {{
                    label: string,
                    onClick(): void,
                    icon?: string,
                    customIcon?: string,
                    disabled?: boolean
                }[]} */
        const bulkButtons = [
            {
                label: t('button_download'),
                icon: 'file_download',
                onClick: fileStore.bulk.download
            },
            {
                label: t('button_move'),
                customIcon: 'move',
                onClick: this.showMoveFiles,
                disabled: !fileStore.bulk.canMove
            },
            {
                label: t('button_delete'),
                icon: 'delete',
                onClick: fileStore.bulk.remove
            }
        ];
        if (config.enableVolumes) {
            bulkButtons.unshift(
                {
                    label: t('button_share'),
                    icon: 'person_add',
                    onClick: this.shareSelected,
                    disabled: !fileStore.bulk.canShare
                }
            );
        }
        return bulkButtons.map(props => (
            <Button
                key={props.label}
                {...props}
            />
        ));
    }

    get breadCrumbsHeader() {
        /** @type {number} */
        const selectedCount = fileStore.selectedFilesOrFolders.length;

        return (
            <div className="files-header"
            // data-folderid={fileStore.folderStore.currentFolder.id}
            // data-storeid={fileStore.folderStore.currentFolder.store.id}
            >
                <Breadcrumb folder={fileStore.folderStore.currentFolder} onFolderClick={setCurrentFolder} />
                {selectedCount > 0
                    ? <div className="buttons-container bulk-buttons">
                        {this.bulkActionButtons}
                    </div>
                    : <div className="buttons-container file-buttons">
                        <Button
                            label={t('button_newFolder')}
                            className="new-folder"
                            onClick={this.showAddFolder}
                            theme="affirmative secondary"
                        />
                        <Button className="button-affirmative"
                            label={t('button_upload')}
                            onClick={handleUpload}
                            theme="affirmative"
                        />
                    </div>
                }
            </div>
        );
    }

    get searchResultsHeader() {
        /** @type {number} */
        const selectedCount = fileStore.selectedFilesOrFolders.length;

        return (
            <div className="files-header">
                <div className="search-results-header">
                    {t('title_searchResults')}
                </div>
                {
                    selectedCount > 0
                        ? <div className="buttons-container bulk-buttons">
                            {this.bulkActionButtons}
                        </div>
                        : null
                }
            </div>
        );
    }

    render() {
        return (
            <React.Fragment>
                <div className="files-header-container">
                    <Search onChange={handleSearch} query={fileStore.searchQuery} />
                    {fileStore.searchQuery ? this.searchResultsHeader : this.breadCrumbsHeader}
                </div>
                <AddOrRenameDialog ref={this.addFolderDialogRef} />
                <MoveFileDialog ref={this.moveFileDialogRef} />
                <ShareWithMultipleDialog ref={this.shareWithMultipleDialogRef} />
            </React.Fragment>
        );
    }
}

module.exports = FilesHeader;
