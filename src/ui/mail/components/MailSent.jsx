const React = require('react');

class MailSent extends React.Component {

    render() {
        console.log('sent ghpst', this.props.ghost)
        return (
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
        );
    }
}

module.exports = MailSent;
