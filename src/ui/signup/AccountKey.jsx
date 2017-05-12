const React = require('react');
const { Component } = require('react');
const { observable, computed } = require('mobx');
const { observer } = require('mobx-react');
const { socket, validation } = require('~/icebear');
const { t } = require('peerio-translator');
const languageStore = require('~/stores/language-store');
const { Button } = require('~/react-toolbox');


const { validators } = validation; // use common validation from core

@observer class AccountKey extends Component {

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
                        <span className="display-1">Don't get</span>
                        <strong className="display-2">Locked out!</strong>
                    </div>
                </div>
                <p>Peerio doesn’t use <em>passwords</em> like other apps. This key protects all your info, <strong>so keep it safe!</strong></p>
                <div>
                    <p>Your Account Key</p>
                    <div className="passphrase selectable">{this.props.profileStore.passphrase}</div>

                </div>
                <p><strong>Save this now.</strong> You’re going to need it later.</p>
            </div>
        );
    }
}

module.exports = AccountKey;
