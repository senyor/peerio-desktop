/* eslint-disable react/no-danger */
const React = require('react');
const { observer } = require('mobx-react');
const { t } = require('peerio-translator');
const { ProgressBar, FontIcon } = require('~/react-toolbox');


@observer
class UploadInChatProgress extends React.Component {
    render() {
        if (!this.props.queue || !this.props.queue.length) return null;
        const file = this.props.queue[0];
        const queued = this.props.queue.length - 1;
        return (
            <div className="chat-upload-progress">
                <div className="progress-content">
                    <FontIcon value="cloud_upload" />
                    <div className="progress-title">Uploading {file.name}
                        {queued ? ` | ${queued} files in queue.` : null}
                    </div>
                </div>
                <ProgressBar type="linear" mode="determinate" value={file.progress}
                                               max={file.progressMax} />
            </div>
        );
    }
}

module.exports = UploadInChatProgress;
