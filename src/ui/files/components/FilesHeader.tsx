import React from 'react';
import { observer } from 'mobx-react';
import { action, computed } from 'mobx';

import { Button, SearchInput } from 'peer-ui';
import { fileStore, chatStore, volumeStore, t } from 'peerio-icebear';
import { Volume } from 'peerio-icebear/dist/models';
import Beacon from '~/ui/shared-components/Beacon';
import beaconStore from '~/stores/beacon-store';

import ShareWithMultipleDialog from '~/ui/shared-components/ShareWithMultipleDialog';

import AddOrRenameDialog from './AddOrRenameDialog';
import MoveFileDialog from './MoveFileDialog';
import Breadcrumb from './Breadcrumb';
import {
    ShareContext,
    setCurrentFolder,
    handleSearch
} from '../helpers/sharedFileAndFolderActions';

@observer
export default class FilesHeader extends React.Component<{
    onUpload: () => void;
}> {
    protected readonly addFolderDialogRef = React.createRef<AddOrRenameDialog>();
    protected readonly moveFileDialogRef = React.createRef<MoveFileDialog>();
    protected readonly shareWithMultipleDialogRef = React.createRef<ShareWithMultipleDialog>();

    protected readonly showAddFolder = () => {
        this.addFolderDialogRef.current.show();
        beaconStore.increment('folders');
    };

    protected readonly showMoveFiles = () => {
        this.moveFileDialogRef.current.show(fileStore.folderStore.currentFolder);
    };

    protected readonly handleClear = () => {
        handleSearch('');
    };

    @action.bound
    protected async shareSelected() {
        let context: ShareContext;
        if (fileStore.selectedFolders.length > 0) {
            context = 'sharefolders';
        } else if (fileStore.selectedFiles.length > 0) {
            context = 'sharefiles';
        } else {
            context = '';
        }

        // first parameter is a mess trying to fix at least one UX case(when 1 folder is selected),
        // needs refactor
        const contacts = await this.shareWithMultipleDialogRef.current.show(
            fileStore.selectedFolders.length > 0 && fileStore.selectedFiles.length === 0
                ? (fileStore.selectedFolders[0] as Volume) // TODO: audit
                : null,
            context
        );
        if (!contacts || !contacts.length) return;

        contacts.forEach(c =>
            chatStore.startChatAndShareFiles([c], fileStore.selectedFiles.slice())
        );
        fileStore.selectedFolders.forEach(f => f.canShare && volumeStore.shareFolder(f, contacts));
        fileStore.clearSelection();
    }

    @computed
    protected get bulkActionButtons() {
        const bulkButtons: {
            label: string;
            onClick(): void;
            icon?: string;
            customIcon?: string;
            disabled?: boolean;
        }[] = [
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
                onClick: fileStore.bulk.remove,
                disabled: !fileStore.bulk.canDelete
            }
        ];
        bulkButtons.unshift({
            label: t('button_share'),
            icon: 'person_add',
            onClick: this.shareSelected,
            disabled: !fileStore.bulk.canShare
        });
        return bulkButtons.map(props => <Button key={props.label} {...props} />);
    }

    protected get breadCrumbsHeader() {
        const selectedCount: number = fileStore.selectedFilesOrFolders.length;

        return (
            <div
                className="files-header"
                // data-folderid={fileStore.folderStore.currentFolder.id}
                // data-storeid={fileStore.folderStore.currentFolder.store.id}
            >
                <Breadcrumb
                    folder={fileStore.folderStore.currentFolder}
                    onFolderClick={setCurrentFolder}
                />
                {selectedCount > 0 ? (
                    <div className="buttons-container bulk-buttons">{this.bulkActionButtons}</div>
                ) : (
                    <div className="buttons-container file-buttons">
                        <Beacon
                            type="area"
                            name="folders"
                            title={t('title_folders_beacon')}
                            description={t('description_folders_beacon')}
                            arrowPosition="top"
                            arrowDistance={80}
                            offsetY={12}
                            markReadOnUnmount
                        >
                            <Button
                                label={t('button_newFolder')}
                                className="new-folder"
                                onClick={this.showAddFolder}
                                theme="affirmative secondary"
                            />
                        </Beacon>
                        <Beacon
                            type="area"
                            name="uploadFiles"
                            title={t('title_uploadFiles_beacon')}
                            description={t('description_uploadFiles_beacon')}
                            arrowPosition="top"
                            arrowDistance={90}
                            offsetY={16}
                            markReadOnUnmount
                        >
                            <Button
                                className="button-affirmative"
                                label={t('button_upload')}
                                onClick={this.props.onUpload}
                                theme="affirmative"
                            />
                        </Beacon>
                    </div>
                )}
            </div>
        );
    }

    protected get searchResultsHeader() {
        const selectedCount: number = fileStore.selectedFilesOrFolders.length;

        return (
            <div className="files-header">
                <div className="search-results-header">{t('title_searchResults')}</div>
                {selectedCount > 0 ? (
                    <div className="buttons-container bulk-buttons">{this.bulkActionButtons}</div>
                ) : null}
            </div>
        );
    }

    render() {
        return (
            <React.Fragment>
                <div className="files-header-container">
                    <SearchInput
                        placeholder={t('title_search')}
                        onChange={handleSearch}
                        onClear={this.handleClear}
                        value={fileStore.searchQuery}
                    />
                    {fileStore.searchQuery ? this.searchResultsHeader : this.breadCrumbsHeader}
                </div>
                <AddOrRenameDialog ref={this.addFolderDialogRef} />
                <MoveFileDialog ref={this.moveFileDialogRef} />
                <ShareWithMultipleDialog ref={this.shareWithMultipleDialogRef} />
            </React.Fragment>
        );
    }
}
