const React = require('react');
const { observable } = require('mobx');
const { observer } = require('mobx-react');
const { t } = require('peerio-translator');
const { Button, Dialog, FontIcon } = require('~/react-toolbox');

const Breadcrumb = require('./Breadcrumb');
// const { fileStore } = require('~/icebear');
// const FileSpriteIcon = require('~/ui/shared-components/FileSpriteIcon');

@observer
class MoveFileDialog extends React.Component {
    @observable selectedFolder = '';
    selectionChange = (index) => {
        this.selectedFolder = index;
        console.log(this.selectedFolder);
    }

    onHide = this.props.onHide;
    handleMove = () => {
        // move folder to selected location
        this.onHide();
    }

    render() {
        const actions = [
            { label: t('button_cancel'), onClick: this.props.onHide },
            { label: t('button_move'), onClick: this.handleMove, disabled: this.selectedFolder === '' }
        ];

        // TODO: dummy content below, need to connect to real files
        const folders = [];
        for (let i = 0; i < 3; i++) {
            folders.push(
                <div key={`folder-${i}`} className="move-file-row">
                    <Button
                        icon={this.selectedFolder === `folder-${i}`
                            ? 'radio_button_checked'
                            : 'radio_button_unchecked'
                        }
                        onClick={() => this.selectionChange(`folder-${i}`)}
                        className="button-small"
                    />
                    <FontIcon value="folder" className="folder-icon" />
                    <div className="file-info">
                        <div className="file-name">
                            Folder name
                        </div>
                        <div className="file-meta">
                            June 5, 2016 - Steve
                        </div>
                    </div>
                    <Button icon="keyboard_arrow_right" className="button-small" />
                </div>
            );
        }

        return (
            <Dialog actions={actions}
                onEscKeyDown={this.props.onHide} onOverlayClick={this.props.onHide}
                active={this.props.visible}
                title={t('title_moveFileTo')}
                className="move-file-dialog">
                <Breadcrumb folderpath={this.props.folderpath} />
                {folders}
            </Dialog>
        );
    }
}

module.exports = MoveFileDialog;
