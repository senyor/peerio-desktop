const React = require('react');
const { action, computed, observable } = require('mobx');
const { observer } = require('mobx-react');

const css = require('classnames');
const T = require('~/ui/shared-components/T');
const { Button, MaterialIcon } = require('peer-ui');
const FileSpriteIcon = require('~/ui/shared-components/FileSpriteIcon');

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
    @observable collapsed = false;

    @action.bound onToggle() {
        this.collapsed = !this.collapsed;
    }

    @computed get downloadQueue() {
        return FILES.map(f => this.fileItem(f, 'download'));
    }

    @computed get uploadQueue() {
        return FILES.map(f => this.fileItem(f, 'upload'));
    }

    fileItem(file, actionType) {
        const cancelFunction = `onCancel${actionType[0].toUpperCase() + actionType.slice(1)}`;

        return (
            <div className="file-item">
                <FileSpriteIcon type={file.iconType} size="small" />
                <span className="file-name">{file.name}</span>

                {file.completed
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
                        onClick={this[cancelFunction]}
                    />
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

    render() {
        return (
            <div className={css('file-status-window', { collapsed: this.collapsed })}>
                <div className="title-bar">
                    <T k="title_fileStatus">{{ number: 43 }}</T>
                    <Button
                        icon={this.collapsed ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                        onClick={this.onToggle}
                        theme="small"
                    />
                </div>
                <div className="body">
                    <div className="heading">
                        <T k="title_downloads" />&nbsp;
                        <span>(24)</span>
                    </div>
                    <div className="files-container">
                        {this.downloadQueue}
                    </div>

                    <div className="heading">
                        <T k="title_uploads" />&nbsp;
                        <span>(24)</span>
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
