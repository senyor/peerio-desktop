const React = require('react');
const { IconButton } = require('~/react-toolbox');
const css = require('classnames');


class MailFormatActions extends React.Component {
    render() {
        return (
            <div className="mail-actions">
                <IconButton icon="attach_file"
                            style={{ marginLeft: '10px', marginRight: '10px' }} />
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
