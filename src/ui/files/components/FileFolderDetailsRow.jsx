// @ts-check
const React = require('react');
const { observer } = require('mobx-react');
const { User } = require('peerio-icebear');
const moment = require('moment');
const { t } = require('peerio-translator');

/**
 * @augments {React.Component<{
        file?: any
        folder?: any
    }, {}>}
 */
@observer
class FileFolderDetailsRow extends React.Component {
    owner = this.props.file
        ? this.props.file.fileOwner
        : this.props.folder.owner;
    date = this.props.file
        ? this.props.file.uploadedAt
        : this.props.folder.createdAt;
    timeStamp = moment(this.date).format('ll');

    render() {
        return (
            <div className="file-folder-details-row">
                <span className="owner">
                    {this.owner === User.current.username
                        ? `${t('title_you')}`
                        : this.owner}
                </span>
                <span className="updated-date">{this.timeStamp}</span>
            </div>
        );
    }
}

module.exports = FileFolderDetailsRow;
