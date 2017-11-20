const React = require('react');
const { observable, action } = require('mobx');
const { observer } = require('mobx-react');
const { t } = require('peerio-translator');
const { Button, Dialog, FontIcon } = require('~/react-toolbox');
const { fileStore } = require('~/icebear');
const Breadcrumb = require('./Breadcrumb');

@observer
class MoveFileDialog extends React.Component {
    @observable selectedFolder = null;
    @observable currentFolder = null;

    componentWillMount() {
        this.currentFolder = this.props.currentFolder;
    }

    @action selectionChange = folder => {
        this.selectedFolder = folder;
    }

    onHide = this.props.onHide;
    @action handleMove = () => {
        const { file, folder } = this.props;
        const target = this.selectedFolder || this.currentFolder;
        target.moveInto(file || folder);
        if (folder) fileStore.folders.save();
        this.onHide();
    }

    render() {
        const { currentFolder } = this;
        const actions = [
            { label: t('button_cancel'), onClick: this.props.onHide },
            { label: t('button_move'), onClick: this.handleMove }
        ];

        const folders = currentFolder.foldersSortedByName.filter(f => f !== this.props.folder).map(folder => (
            <div key={`folder-${folder.folderId}`} className="move-file-row">
                <Button
                    icon={this.selectedFolder === folder ?
                        'radio_button_checked' : 'radio_button_unchecked'}
                    onClick={() => this.selectionChange(folder)}
                    className="button-small"
                />
                <FontIcon value="folder" className="folder-icon" />
                <div className="file-info" onClick={() => { this.currentFolder = folder; }}>
                    <div className="file-name">{folder.name}</div>
                </div>
                <Button
                    onClick={() => { this.currentFolder = folder; }}
                    icon="keyboard_arrow_right" className="button-small" />
            </div>
        ));

        return (
            <Dialog actions={actions}
                onEscKeyDown={this.props.onHide} onOverlayClick={this.props.onHide}
                active={this.props.visible}
                title={t('title_moveFileTo')}
                className="move-file-dialog">
                <Breadcrumb
                    currentFolder={currentFolder}
                    onSelectFolder={folder => { this.currentFolder = folder; }} />
                {folders}
            </Dialog>
        );
    }
}

module.exports = MoveFileDialog;
