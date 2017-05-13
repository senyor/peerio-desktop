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
                        <span className="display-1">{t('title_AKwarn1')}</span>
                        <strong className="display-2">{t('title_AKwarn2')}</strong>
                    </div>
                </div>
                <p>{t('title_AKwarn3')}</p>
                <div>
                    <p>{t('title_yourAccountKey')}</p>
                    <div className="passphrase selectable">{this.props.profileStore.passphrase}</div>

                </div>
                <p>{t('title_AKwarn4')}</p>
            </div>
        );
    }
}

module.exports = AccountKey;
