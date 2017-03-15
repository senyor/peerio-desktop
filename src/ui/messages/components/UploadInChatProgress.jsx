/* eslint-disable react/no-danger */
const React = require('react');
const { observer } = require('mobx-react');
const { t } = require('peerio-translator');
const { ProgressBar, FontIcon, IconButton } = require('~/react-toolbox');

@observer
class UploadInChatProgress extends React.Component {
    cancelUpload = () => {
        if (confirm('Cancel upload?')) {
            this.props.queue[0].cancelUpload();
        }
    };
    render() {
        if (!this.props.queue || !this.props.queue.length) return null;
        const file = this.props.queue[0];
        const queued = this.props.queue.length - 1;
        return (
            <div className="chat-upload-progress">
                <div className="progress-content">
                    <FontIcon value="cloud_upload" />
                    <div className="progress-title">
                        {queued ? t('title_queuedFiles', { name: file.name }, { remaining: queued }) : t('title_uploading', { name: file.name })}
                    </div>
                    <IconButton icon="cancel" onClick={this.cancelUpload} />
                </div>
                <ProgressBar type="linear" mode="determinate" value={file.progress}
                                               max={file.progressMax} />
            </div>
        );
    }
}

module.exports = UploadInChatProgress;
