const React = require('react');
const { Component } = require('react');
const { observable, computed } = require('mobx');
const { observer } = require('mobx-react');
const { Button } = require('~/react-toolbox');
const { socket, validation } = require('~/icebear');
const { t } = require('peerio-translator');
const languageStore = require('~/stores/language-store');


const { validators } = validation; // use common validation from core

@observer class SaveNow extends Component {

    handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            this.props.returnHandler();
        }
    };

    render() {
        return (
            <div className="flex-col profile">
                <div className="warning-line">
                    <div className="flex-col flex-justify-center" style={{ width: '275px' }}>
                        <span className="display-1">No really, </span>
                        <strong className="display-2">this is important!</strong>
                    </div>
                </div>
                <p>We never store your key, so we can’t recover or reset it for you.</p>
                <p>If you lose this key you will lose all your Peerio contacts and files,
                   and you’ll have to create a new account. Save it now!</p>
                <div>
                    <p>Your Account Key</p>
                    <div className="passphrase">account key goes here Anri</div>
                </div>
                <Button icon="file_download" label="Save now" className="gradient" />
            </div>
        );
    }
}

module.exports = SaveNow;
