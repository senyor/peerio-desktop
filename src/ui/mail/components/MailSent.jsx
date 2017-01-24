const React = require('react');
const MailSidebar = require('./MailSidebar');


class MailSent extends React.Component {

    render() {
        console.log('sent ghpst', this.props.ghost);
        return (
            <div>
                <div className="compose-view">
                    <div className="compose-meta sent">
                        <div className="subject">{this.props.ghost.subject}</div>
                        <div className="date">{this.props.ghost.date.toLocaleString()}</div>
                        <div className="to">{this.props.ghost.recipients.join(',')}</div>
                    </div>
                    <div className="mail-content">
                        {this.props.ghost.body}
                    </div>
                </div>
                <MailSidebar ghost={this.props.ghost} />
            </div>
        );
    }
}

module.exports = MailSent;
