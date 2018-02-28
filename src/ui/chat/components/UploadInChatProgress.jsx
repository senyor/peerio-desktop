/* eslint-disable react/no-danger */
const React = require('react');
const { observer } = require('mobx-react');
const UploadFileProgress = require('./UploadFileProgress');
const ShareFolderProgress = require('./ShareFolderProgress');

@observer
class UploadInChatProgress extends React.Component {
    render() {
        if (!this.props.queue || !this.props.queue.length) return null;
        const file = this.props.queue[0];
        const queued = this.props.queue.length - 1;
        return (
            file.isFolder ? <ShareFolderProgress /> : <UploadFileProgress file={file} remaining={queued} />
        );
    }
}

module.exports = UploadInChatProgress;
