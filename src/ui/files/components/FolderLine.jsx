const React = require('react');
const { observable, action } = require('mobx');
const { observer } = require('mobx-react');
const FolderActions = require('./FolderActions');
const { MaterialIcon } = require('~/peer-ui');
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
                className="row"
                onMouseEnter={this.onShowActions}
                onMouseLeave={this.onHideActions}>
                {this.props.folderDetails &&
                    <div className="loading-icon" />
                }

                {this.props.checkboxPlaceholder &&
                    <div className="file-checkbox" />
                }

                <div className="file-icon"
                    onClick={this.props.onChangeFolder} >
                    <MaterialIcon icon="folder" />
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

                {this.props.folderActions &&
                    <div className="file-actions text-right">
                        <FolderActions
                            onRename={this.props.onRenameFolder}
                            moveable={this.props.moveable}
                            onMove={this.props.onMoveFolder}
                            onDelete={this.props.onDeleteFolder}
                        />
                    </div>
                }
            </div>
        );
    }
}

module.exports = FolderLine;
