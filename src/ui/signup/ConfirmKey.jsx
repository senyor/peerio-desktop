const React = require('react');
const { Component } = require('react');
const { observer } = require('mobx-react');
const { Input } = require('~/react-toolbox');
const { t } = require('peerio-translator');
const T = require('~/ui/shared-components/T');


@observer class ConfirmKey extends Component {
    handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            this.props.returnHandler();
        }
    };

    render() {
        return (
            <div className="flex-col">
                <div className="confirm-key">
                    <div className="safe" />
                    <div className="headline">Remember, we can’t access your data.</div>
                    <p>Only you have a copy of your Account Key.</p>
                    <p>If you lose it, we cannot help you access your account.</p>
                    <p>Confirm that you’ve saved your key by entering  “I have saved my account key” in the input below. </p>
                    <Input />
                </div>
            </div>
        );
    }
}

module.exports = ConfirmKey;
