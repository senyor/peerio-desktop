// @ts-check
const React = require('react');
const { observer } = require('mobx-react');
const { observable, action } = require('mobx');
const { Divider, Menu, MenuItem, Dialog } = require('peer-ui');
const { chatStore, fileStore } = require('peerio-icebear');

const MoveFileDialog = require('./MoveFileDialog');
const ShareWithMultipleDialog = require('~/ui/shared-components/ShareWithMultipleDialog');
const T = require('~/ui/shared-components/T');
const { t } = require('peerio-translator');
const { downloadFile } = require('~/helpers/file');
const {
    isFileOrFolderMoveable,
    isFileShareable,
    isFileDeleteable,
    fileDownloadUIEnabled
} = require('../helpers/sharedFileAndFolderActions');

/**
 * @augments {React.Component<{
        file: any

        /// is the entire action menu disabled?
        disabled?: boolean

        onMenuClick?: () => void
        onMenuHide?: () => void

        onDelete?: () => any
        /// 4/7/18: currently "unshare" is only available in inline files;
        /// the action needs to be passed in explicitly since (as far as i
        /// understand) the file keg passed in to this component in InlineFiles
        /// is a different kind of keg than the one passed in via eg. a
        /// FileLine in the Files view.
        onUnshare?: () => any

        /// not implemented
        onRename?: () => any

    }, {}>}
 */
@observer
class FileActions extends React.Component {
    moveFileDialogRef = React.createRef();
    shareWithMultipleDialogRef = React.createRef();

    @observable limitedActionsVisible = false;
    @action.bound showLimitedActions() {
        this.limitedActionsVisible = true;
    }
    @action.bound hideLimitedActions() {
        this.limitedActionsVisible = false;
    }

    downloadFile = () => {
        downloadFile(this.props.file);
    }

    moveFile = () => {
        const folder = this.props.file.folder || fileStore.folderStore.root;
        this.moveFileDialogRef.current.show(folder, this.props.file);
    }

    shareFile = async () => {
        const contacts = await this.shareWithMultipleDialogRef.current.show(null, 'sharefiles');

        if (!contacts || !contacts.length) return;
        contacts.forEach(c => chatStore.startChatAndShareFiles([c], this.props.file));
    }

    render() {
        const { file } = this.props;

        return (
            <React.Fragment>
                <Menu
                    className="item-actions"
                    icon="more_vert"
                    position="bottom-right"
                    onClick={this.props.onMenuClick}
                    onHide={this.props.onMenuHide}
                    disabled={this.props.disabled}
                >
                    {file.isLegacy
                        ? <MenuItem caption={t('button_learnMore')}
                            icon="info"
                            onClick={this.showLimitedActions}
                        />
                        : null
                    }

                    <MenuItem caption={t('button_share')}
                        icon="person_add"
                        onClick={this.shareFile}
                        disabled={!isFileShareable(file) || file.isLegacy}
                    />
                    <MenuItem caption={t('title_download')}
                        icon="file_download"
                        onClick={this.downloadFile}
                        disabled={!fileDownloadUIEnabled(file)}
                    />
                    {isFileOrFolderMoveable(file)
                        ? <MenuItem caption={t('button_move')}
                            className="custom-icon-hover-container"
                            customIcon="move"
                            onClick={this.moveFile}
                        />
                        : null
                    }
                    {false // eslint-disable-line no-constant-condition, TODO
                        ? <MenuItem caption={t('button_rename')}
                            icon="mode_edit"
                            onClick={this.props.onRename}
                        />
                        : null
                    }
                    {isFileDeleteable(file)
                        ? <React.Fragment>
                            <Divider />
                            {this.props.onDelete && <MenuItem
                                caption={t('button_delete')}
                                icon="delete"
                                onClick={this.props.onDelete}
                            />}
                            {/* Unshare conditions are the same as delete conditions */}
                            {this.props.onUnshare && <MenuItem
                                caption={t('button_unshare')}
                                icon="remove_circle_outline"
                                onClick={this.props.onUnshare}
                            />}
                        </React.Fragment>
                        : null}
                </Menu>
                <LimitedActionsDialog active={this.limitedActionsVisible} onDismiss={this.hideLimitedActions} />
                <ShareWithMultipleDialog ref={this.shareWithMultipleDialogRef} />
                <MoveFileDialog ref={this.moveFileDialogRef} />
            </React.Fragment>
        );
    }
}

const LimitedActionsDialog = ({ active, onDismiss }) => (
    <Dialog
        active={active}
        className="limited-actions-dialog"
        actions={[{ label: t('button_gotIt'), onClick: onDismiss }]}
        onCancel={onDismiss}
        title={t('title_limitedActions')}
        size="small"
    >
        <T k="dialog_limitedActionsContent" className="text" />
    </Dialog>
);

module.exports = FileActions;
