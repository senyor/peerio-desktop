const React = require('react');
const { observable } = require('mobx');
const { observer } = require('mobx-react');
const { Dialog, IconButton, IconMenu, MenuDivider, MenuItem, Switch, Tooltip } = require('~/react-toolbox');
const MailSentSidebar = require('./MailSentSidebar');
const InlineFiles = require('../../messages/components/InlineFiles');
const { fileStore } = require('~/icebear');
const { t } = require('peerio-translator');


const TooltipIcon = Tooltip()(IconButton); //eslint-disable-line

@observer
class MailSent extends React.Component {

    @observable dialogActive = false;

    handleClose = () => {
        this.dialogActive = false;
    };

    actions = [
        { label: 'Cancel', onClick: this.handleClose },
        { label: 'Confirm', onClick: this.handleClose, primary: true }
    ];

    handleDelete = () => {
        this.dialogActive = true;
        // todo  mailRevoked ? delete and trigger snackbar 'Mail Deleted' or something.
        //           : dialog (cance or confirm delete without revoking, and trigger snackbar.)
    }


    render() {
        return (
            <div className="flex-row flex-grow-1">
                <div className="compose-view">
                    <div className="compose-meta sent">
                        <div className="flex-row flex-align-center flex-justify-between"
                             style={{ height: '36px' }}>
                            <div className="subject">{this.props.ghost.subject}</div>
                            <TooltipIcon
                                tooltip={t('delete_mail')}
                                tooltipDelay={250}
                                tooltipPosition="bottom"
                                icon="delete"
                                onClick={this.handleDelete} />

                            {this.props.ghost.files.length ?
                                <div className="attached-files">
                                    {this.props.ghost.files.length}
                                    <IconMenu icon="attachment">
                                        <MenuItem caption="Download all"
                                                  icon="file_download" />
                                        <MenuDivider />
                                        {this.props.ghost.files.map(f => {
                                            const file = fileStore.getById(f);
                                            return (
                                                <MenuItem caption={file.name}
                                                          icon="file_download" />);
                                        })}
                                    </IconMenu>
                                </div> : null
                            }
                        </div>
                        <div className="date">{this.props.ghost.date.toLocaleString()}</div>
                        <div className="to">{this.props.ghost.recipients.join(',')}</div>
                    </div>
                    <div className="mail-content sent-content">
                        {this.props.ghost.body}
                    </div>
                    {this.props.ghost.files !== 0 ? <InlineFiles files={this.props.ghost.files} /> : null}

                </div>
                <MailSentSidebar ghost={this.props.ghost} />
                <Dialog title="Revoke Mail"
                        actions={this.actions}
                        active={this.dialogActive}
                        onEscKeyDown={this.handleClose}
                        onOverlayClick={this.handleClose}>
                    This message has not been revoked. The recipient(s) can continue
                    to access the message until it expires.

                </Dialog>
            </div>
        );
    }
}

module.exports = MailSent;
