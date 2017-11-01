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
        if (file) {
            this.selectedFolder.moveInto(file);
            fileStore.fileFolders.save();
        } else if (folder) {
            console.log('move folder');
        }
        this.onHide();
    }

    render() {
        const { currentFolder } = this;
        const actions = [
            { label: t('button_cancel'), onClick: this.props.onHide },
            { label: t('button_move'), onClick: this.handleMove, disabled: !this.selectedFolder }
        ];

        // TODO: dummy content below, need to connect to real files
        const folders = currentFolder.folders.map(folder => (
            <div key={`folder-${folder.folderId}`} className="move-file-row">
                <Button
                    icon={this.selectedFolder === folder ?
                        'radio_button_checked' : 'radio_button_unchecked'}
                    onClick={() => this.selectionChange(folder)}
                    className="button-small"
                />
                <FontIcon value="folder" className="folder-icon" />
                <div className="file-info">
                    <div className="file-name">{folder.name}</div>
                </div>
                <Button icon="keyboard_arrow_right" className="button-small" />
            </div>
        ));

        return (
            <Dialog actions={actions}
                onEscKeyDown={this.props.onHide} onOverlayClick={this.props.onHide}
                active={this.props.visible}
                title={t('title_moveFileTo')}
                className="move-file-dialog">
                <Breadcrumb currentFolder={currentFolder} />
                {folders}
            </Dialog>
        );
    }
}

module.exports = MoveFileDialog;
