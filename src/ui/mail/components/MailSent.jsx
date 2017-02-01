const React = require('react');
const MailSidebar = require('./MailSidebar');
const InlineFiles = require('../../messages/components/InlineFiles');


class MailSent extends React.Component {

    render() {
        console.log('sent ghost', this.props.ghost);
        return (
            <div className="flex-row flex-grow-1">
                <div className="compose-view">
                    <div className="compose-meta sent">
                        <div className="subject">{this.props.ghost.subject}</div>
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
