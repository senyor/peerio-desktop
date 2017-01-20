const React = require('react');
const { t } = require('peerio-translator');
const { Button, FontIcon } = require('~/react-toolbox');
const { chatStore } = require('~/icebear');
const { observer } = require('mobx-react');
const css = require('classnames');

class CorruptMessage extends React.Component {
    render() {
        return (
            <div className="corrupt-message">
                <FontIcon icon="vpn_key" />
                Bob's key has changed
                <Button label="info" />
            </div>
        );
    }
}

module.exports = CorruptMessage;
