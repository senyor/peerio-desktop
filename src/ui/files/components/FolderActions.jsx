// @ts-check
const React = require('react');
const { observer } = require('mobx-react');
const { Menu, MenuItem, Divider } = require('peer-ui');
const { t } = require('peerio-translator');
const config = require('~/config');

const AddOrRenameDialog = require('./AddOrRenameDialog');
const MoveFileDialog = require('./MoveFileDialog');
const ShareWithMultipleDialog = require('~/ui/shared-components/ShareWithMultipleDialog');

const { volumeStore } = require('peerio-icebear');

const {
    deleteFileOrFolder,
    downloadFolder,
    isFileOrFolderMoveable
} = require('../helpers/sharedFileAndFolderActions');

/**
 * @augments {React.Component<{
        folder: any,
        onMenuClick?: () => void
        onMenuHide?: () => void
        /// Currently used when Move/Share/Rename dialog has been opened, to affect selection state in parent FileLine
        onActionInProgress?: () => void
        position?: "top-left" | "top-right" | "bottom-left" | "bottom-right"
        /// Is the entire action menu disabled?
        disabled?: boolean,
        deleteDisabled?: boolean
        shareDisabled?: boolean
        downloadVisible?: boolean
        downloadDisabled?: boolean
    }, {}>}
 */
@observer
class FolderActions extends React.Component {
    shareWithMultipleDialogRef = React.createRef();
    moveFileDialogRef = React.createRef();
    renameFolderDialogRef = React.createRef();

    deleteFolder = () => {
        deleteFileOrFolder(this.props.folder);
    }

    downloadFolder = () => {
        downloadFolder(this.props.folder);
    }

    shareFolder = async () => {
        if (this.props.onActionInProgress) this.props.onActionInProgress();
        const f = this.props.folder;

        const contacts = await this.shareWithMultipleDialogRef.current.show(
            f.isShared ? f : null,
            'sharefolders'
        );

        if (!contacts || !contacts.length) return;
        await volumeStore.shareFolder(f, contacts);
    }

    renameFolder = () => {
        if (this.props.onActionInProgress) this.props.onActionInProgress();
        this.renameFolderDialogRef.current.show(this.props.folder);
    }

    moveFolder = () => {
        if (this.props.onActionInProgress) this.props.onActionInProgress();
        this.moveFileDialogRef.current.show(this.props.folder.parent, this.props.folder);
    }

    render() {
        const {
            folder,
            downloadVisible,
            downloadDisabled
        } = this.props;

        /** @type {boolean} */
        const shareVisible = folder.isShared || folder.canShare;

        return (
            <React.Fragment>
                <Menu
                    className="item-actions"
                    icon="more_vert"
                    position={this.props.position || 'bottom-right'}
                    onClick={this.props.onMenuClick}
                    onHide={this.props.onMenuHide}
                    disabled={this.props.disabled}
                >
                    {shareVisible && config.enableVolumes
                        ? <MenuItem caption={t('button_share')}
                            icon="person_add"
                            onClick={this.shareFolder}
                            disabled={this.props.shareDisabled}
                        />
                        : null
                    }
                    {downloadVisible && <MenuItem caption={t('title_download')}
                        icon="file_download"
                        onClick={this.downloadFolder}
                        disabled={downloadDisabled}
                    />}
                    {isFileOrFolderMoveable(folder) &&
                        <MenuItem caption={t('button_move')}
                            className="custom-icon-hover-container"
                            customIcon="move"
                            onClick={this.moveFolder}
                        />
                    }
                    <MenuItem caption={t('button_rename')}
                        icon="mode_edit"
                        onClick={this.renameFolder} />
                    <Divider />
                    <MenuItem caption={t('button_delete')}
                        icon="delete"
                        onClick={this.deleteFolder}
                        disabled={this.props.deleteDisabled}
                    />
                </Menu>
                <AddOrRenameDialog ref={this.renameFolderDialogRef} />
                <MoveFileDialog ref={this.moveFileDialogRef} />
                <ShareWithMultipleDialog ref={this.shareWithMultipleDialogRef} />
            </React.Fragment>
        );
    }
}

module.exports = FolderActions;
