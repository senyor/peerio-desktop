const React = require('react');
const { action, computed, observable } = require('mobx');
const { observer } = require('mobx-react');

const css = require('classnames');
const uiStore = require('~/stores/ui-store');
const T = require('~/ui/shared-components/T');
const { Button, MaterialIcon, ProgressBar } = require('peer-ui');
const FileSpriteIcon = require('~/ui/shared-components/FileSpriteIcon');

// Just for testing
const FILES = [
    { name: 'file.jpg', iconType: 'img' },
    { name: 'file.jpg', iconType: 'img' },
    { name: 'file.jpg', iconType: 'img' },
    { name: 'file.jpg', iconType: 'img' },
    { name: 'file.jpg', iconType: 'img' },
    { name: 'file.jpg', iconType: 'img' },
    { name: 'file.jpg', iconType: 'img' },
    { name: 'file.jpg', iconType: 'img' },
    { name: 'file.jpg', iconType: 'img' },
    { name: 'file.jpg', iconType: 'img' }
];

@observer
class FileStatusWindow extends React.Component {
    @observable allCompleted = true;

    @action.bound toggleWindow() {
        uiStore.fileStatusWindowCollapsed = !uiStore.fileStatusWindowCollapsed;
    }

    @computed get downloadQueue() { return FILES.map(f => this.fileItem(f, 'download')); }
    @computed get uploadQueue() { return FILES.map(f => this.fileItem(f, 'upload')); }

    fileItem(file, actionType) {
        const cancelFunction = `onCancel${actionType[0].toUpperCase() + actionType.slice(1)}`;

        return (
            <div className={css('file-item', {error: file.error })}>
                <FileSpriteIcon type={file.iconType} size="small" />
                <span className="file-name">{file.name}</span>

                {file.error
                    ? <MaterialIcon icon="error_outline" className="right-icon error" />
                    : file.completed
                        ? (
                            <span className="right-icon">
                                <MaterialIcon className="completed" icon="check" />
                                <Button
                                    className="find-file"
                                    icon="search"
                                    theme="small"
                                    onClick={() => this.findFile(file)}
                                />
                            </span>
                        )
                        : <Button
                            className="right-icon"
                            icon="highlight_off"
                            theme="small"
                            onClick={this[cancelFunction]}
                        />
                }

                {file.progress
                    ? <ProgressBar value={50} max={100} />
                    : null
                }
            </div>
        );
    }

    onCancelDownload() {
        console.log('cancel download');
    }

    onCancelUpload() {
        console.log('cancel upload');
    }

    findFile(file) {
        console.log('find file');
    }

    render() {
        return (
            <div className={css('file-status-window', { collapsed: uiStore.fileStatusWindowCollapsed })}>
                <div className="title-bar">
                    <T k="title_fileStatus">{{ number: FILES.length + FILES.length }}</T>
                    <div className="buttons-container">
                        <Button
                            icon={uiStore.fileStatusWindowCollapsed ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                            onClick={this.toggleWindow}
                            theme="small"
                        />
                        {this.allCompleted
                            ? <Button
                                icon="close"
                                onClick={this.closeWindow}
                                theme="small"
                            />
                            : null
                        }
                    </div>
                </div>
                <div className="body">
                    <div className="heading">
                        <T k="title_downloads" />&nbsp;
                        <span>({FILES.length})</span>
                    </div>
                    <div className="files-container">
                        {this.downloadQueue}
                    </div>

                    <div className="heading">
                        <T k="title_uploads" />&nbsp;
                        <span>({FILES.length})</span>
                    </div>
                    <div className="files-container">
                        {this.uploadQueue}
                    </div>
                </div>
            </div>
        );
    }
}

module.exports = FileStatusWindow;
