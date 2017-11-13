const React = require('react');
const { observable } = require('mobx');
const { observer } = require('mobx-react');
const FolderActions = require('./FolderActions');
const { FontIcon } = require('~/react-toolbox');
const { t } = require('peerio-translator');

@observer
class FolderLine extends React.Component {
    @observable showActions = false;

    onShowActions = () => {
        this.showActions = true;
    };

    onHideActions = () => {
        this.showActions = false;
    };

    render() {
        const folder = this.props.folder;

        return (
            <div className="row" onMouseEnter={this.onShowActions} onMouseLeave={this.onHideActions}>
                {this.props.folderDetails &&
                    <div className="loading-icon" />
                }

                <div className="file-icon">
                    <FontIcon value="folder" />
                </div>

                <div className="file-name clickable selectable"
                    onClick={() => this.props.onChangeFolder(this.props.folder)} >
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
                            onRename={() => this.props.onRenameFolder(this.props.folder)}
                            onMove={() => this.props.onMoveFolder(this.props.folder)}
                            onDelete={() => this.props.onDeleteFolder(this.props.folder)}
                        />
                    </div>
                }
            </div>
        );
    }
}

module.exports = FolderLine;
