const React = require('react');
const { observable, action } = require('mobx');
const { observer } = require('mobx-react');
const css = require('classnames');
const FolderActions = require('./FolderActions');
const { Checkbox, MaterialIcon, ProgressBar } = require('~/peer-ui');
const { t } = require('peerio-translator');

@observer
class FolderLine extends React.Component {
    @observable showActions = false;

    @action.bound onShowActions() {
        this.showActions = true;
    }

    @action.bound onHideActions() {
        this.showActions = false;
    }

    render() {
        const { folder } = this.props;
        return (
            <div data-folderid={folder.folderId}
                className={css(
                    'row',
                    this.props.className,
                    {
                        'selected-row': this.props.selected,
                        disabled: folder.isBlocked
                    }
                )}
                onMouseEnter={this.onShowActions}
                onMouseLeave={this.onHideActions}>

                {this.props.shareProgress
                    ? <div className="file-checkbox folder-share-progress">
                        {`${this.props.shareProgress}%`}
                        <ProgressBar value={this.props.shareProgress} max={100} />
                    </div>
                    : this.props.checkbox
                        ? <Checkbox
                            className={css('file-checkbox', { disabled: this.props.disabledCheckbox })}
                            checked={this.props.selected}
                            onChange={this.props.disabledCheckbox ? null : this.props.onToggleSelect}
                        />
                        : <div className="file-checkbox" />
                }

                <div className="file-icon"
                    onClick={this.props.onChangeFolder} >
                    <MaterialIcon icon={folder.isShared ? 'folder_shared' : 'folder'} />
                </div>

                <div className="file-name clickable selectable"
                    onClick={this.props.onChangeFolder} >
                    {folder.name}
                </div>

                {this.props.folderDetails &&
                    <div className="file-owner">
                        {t('title_you')}
                    </div>
                }

                {this.props.folderDetails && <div className="file-uploaded text-right" /> }

                {this.props.folderDetails && <div className="file-size text-right" /> }

                { /* TODO: use spread operator */
                    this.props.folderActions &&
                    <div className="file-actions">
                        <FolderActions
                            onClick={this.props.onClick}
                            onRename={this.props.onRenameFolder}
                            onMove={folder.isShared ? null : this.props.onMoveFolder}
                            onDelete={this.props.onDeleteFolder}
                            onShare={this.props.onShare}
                            data-folderid={folder.folderId}
                            disabled={this.props.selected || folder.isBlocked}
                        />
                    </div>
                }
            </div>
        );
    }
}

module.exports = FolderLine;
