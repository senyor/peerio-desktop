const React = require('react');
const { IconButton } = require('~/react-toolbox');


class MailFormatActions extends React.Component {
    render() {
        return (
            <div className="mail-actions">
                <div className="counter">
                    <IconButton icon="attach_file"
                                onClick={this.props.onFileAttach}
                                style={{ marginLeft: '10px', marginRight: '10px' }} />
                    {this.props.fileCounter === 0 ?
                         null : <div className="count">{this.props.fileCounter}</div>}
                </div>
                <div className="mail-format">
                    <IconButton icon="format_bold" />
                    <IconButton icon="format_italic" />
                    <IconButton icon="format_underline" />
                    <IconButton icon="strikethrough_s" />
                </div>
                <IconButton icon="delete"
                            style={{ marginLeft: '10px', marginRight: '10px' }} />

            </div>
        );
    }
}

module.exports = MailFormatActions;
