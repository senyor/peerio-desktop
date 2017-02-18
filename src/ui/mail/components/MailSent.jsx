const React = require('react');
const { IconButton, IconMenu, MenuDivider, MenuItem, Tooltip } = require('~/react-toolbox');
const MailSentSidebar = require('./MailSentSidebar');
const InlineFiles = require('../../messages/components/InlineFiles');
const { fileStore } = require('~/icebear');

const TooltipIcon = Tooltip()(IconButton); //eslint-disable-line

class MailSent extends React.Component {

    handleDelete = () => {
        console.log('DELETING MAIL!');
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
                                tooltip="Delete mail"
                                tooltipDelay="250"
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
            </div>
        );
    }
}

module.exports = MailSent;
