const React = require('react');
const { IconMenu, MenuDivider, MenuItem } = require('~/react-toolbox');
const MailSidebar = require('./MailSidebar');
const InlineFiles = require('../../messages/components/InlineFiles');
const { fileStore } = require('~/icebear');

class MailSent extends React.Component {

    render() {
        return (
            <div className="flex-row flex-grow-1">
                <div className="compose-view">
                    <div className="compose-meta sent">
                        <div className="flex-row flex-align-center flex-justify-between"
                             style={{ height: '36px' }}>
                            <div className="subject">{this.props.ghost.subject}</div>
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
                <MailSidebar ghost={this.props.ghost} />
            </div>
        );
    }
}

module.exports = MailSent;
