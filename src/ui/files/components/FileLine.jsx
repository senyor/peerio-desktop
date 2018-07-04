// @ts-check
const React = require('react');
const { action, observable } = require('mobx');
const { observer } = require('mobx-react');

const { contactStore, User } = require('peerio-icebear');
const { downloadFile } = require('~/helpers/file');
const moment = require('moment');
const css = require('classnames');
const T = require('~/ui/shared-components/T');
const { t } = require('peerio-translator');
const uiStore = require('~/stores/ui-store');

const { Checkbox, ProgressBar, Tooltip } = require('peer-ui');

const ContactProfile = require('~/ui/contact/components/ContactProfile');
const FileActions = require('./FileActions');
const FileSpriteIcon = require('~/ui/shared-components/FileSpriteIcon');


/**
 * @augments {React.Component<{
        file: any,
        checkbox: boolean,
        isDragging?: boolean,
        className?: string,
        clickToSelect?: true,
        fileDetails?: true,
        fileActions?: true
    }, {}>}
 */
@observer
class FileLine extends React.Component {
    // 21 hour limit for displaying relative timestamp (because moment.js says '1 day' starting from 21h)
    static relativeTimeDisplayLimit = 21 * 60 * 60 * 1000;

    @observable hovered;
    @action.bound onMenuClick() { this.hovered = true; }
    @action.bound onMenuHide() { this.hovered = false; }

    cancelUploadOrDownload = () => {
        this.props.file.cancelUpload();
        this.props.file.cancelDownload();
    };

    download = () => {
        downloadFile(this.props.file);
    };

    deleteFile = () => {
        let msg = t('title_confirmRemoveFilename', { name: this.props.file.name });
        if (this.props.file.shared) {
            msg += `\n\n${t('title_confirmRemoveSharedFiles')}`;
        }
        if (confirm(msg)) {
            this.props.file.remove();
        }
    };

    setContactProfileRef = (ref) => {
        if (ref) this.contactProfileRef = ref;
    }

    @action.bound
    toggleSelected() {
        this.props.file.selected = !this.props.file.selected;
    }

    @observable clickedContact;
    @action.bound openContact() {
        this.clickedContact = contactStore.getContact(this.props.file.fileOwner);
        this.contactProfileRef.openDialog();
    }

    render() {
        const { file, isDragging } = this.props;

        // We want relative timestamp in case it's not older then 1 day.
        // In case of relative timestamp we also want to re-render periodically to update it
        let uploadedAt, uploadedAtTooltip;

        if (file.uploadedAt) {
            // if file timestamp is past the limit...
            if (Date.now() - file.uploadedAt > FileLine.relativeTimeDisplayLimit) {
                uploadedAt = file.uploadedAt.toLocaleString();
                // this condition is always true and we need it only to subscribe to clock updates
            } else if (uiStore.minuteClock.now) {
                uploadedAt = moment(file.uploadedAt).fromNow();
                uploadedAtTooltip = file.uploadedAt.toLocaleString();
            }
        }

        return (
            /*
                This superfluous row-container is needed to make styles consistent with FolderLine,
                which *does* need the container to hold elements other than .row
            */
            <div className={css(
                'row-container',
                'file-row-container',
                this.props.className,
                {
                    hover: this.hovered,
                    selected: file.selected,
                    'selected-row': file.selected,
                    'waiting-3rd-party': !file.uploading && !file.readyForDownload,
                    'dragged-row': isDragging
                }
            )}>
                <div className="row">
                    {this.props.checkbox ?
                        <Checkbox
                            className="file-checkbox"
                            checked={file.selected}
                            onChange={this.toggleSelected}
                        />
                        : <div className="file-checkbox" />
                    }

                    <div className="file-icon"
                        onClick={this.props.clickToSelect
                            ? this.toggleSelected
                            : this.download
                        } >
                        <FileSpriteIcon
                            type={file.iconType}
                            size="medium"
                        />
                    </div>

                    <div className="file-name"
                        onClick={this.props.clickToSelect
                            ? this.toggleSelected
                            : this.download
                        } >
                        {file.name}
                    </div>

                    {this.props.fileDetails &&
                        <div className="file-owner clickable" onClick={this.openContact}>
                            {file.fileOwner === User.current.username ? `${t('title_you')}` : file.fileOwner}
                        </div>
                    }

                    {this.props.fileDetails &&
                        <div className="file-uploaded" title={uploadedAtTooltip}>
                            {uploadedAt}
                            {file.isLegacy &&
                                <div className="badge-old-version">
                                    <T k="title_pending" />
                                    <Tooltip text={t('title_oldVersionTooltip')} />
                                </div>
                            }
                        </div>
                    }

                    {this.props.fileDetails &&

                        <div className="file-size">{file.sizeFormatted}</div>
                    }

                    {this.props.fileActions &&
                        <div className="file-actions">
                            <FileActions
                                file={file}
                                onMenuClick={this.onMenuClick}
                                onMenuHide={this.onMenuHide}
                                onDelete={this.deleteFile}
                                disabled={file.selected}
                            />
                        </div>
                    }
                </div>

                {(file.downloading || file.uploading)
                    ? <ProgressBar type="linear" mode="determinate" value={file.progress}
                        max={file.progressMax} />
                    : null}

                {this.props.fileDetails &&
                    <ContactProfile
                        ref={this.setContactProfileRef}
                        contact={this.clickedContact}
                    />
                }
            </div>
        );
    }
}

module.exports = FileLine;
