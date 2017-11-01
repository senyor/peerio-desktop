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
            <tr onMouseEnter={this.onShowActions} onMouseLeave={this.onHideActions}>
                <td />
                <td className="file-icon">
                    <FontIcon value="folder" />
                </td>
                <td className="file-title selectable"
                    onClick={() => this.props.onChangeFolder(this.props.folder)} >
                    {folder.name}
                </td>

                <td className="clickable-username">
                    {t('title_you')}
                </td>
                <td className="text-right" />
                <td className="text-right" />
                <td className="text-right">
                    <FolderActions
                        onRename={() => this.props.onRenameFolder(this.props.folder)}
                        onMove={() => this.props.onMoveFolder(this.props.folder)}
                        onDelete={() => this.props.onDeleteFolder(this.props.folder)}
                    />
                </td>
            </tr>
        );
    }
}

module.exports = FolderLine;
