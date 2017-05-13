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
                        <span className="display-1">{t('title_saveNow1')}</span>
                        <strong className="display-2">{t('title_saveNow2')}</strong>
                    </div>
                </div>
                <p>{t('title_saveNow3')}</p>
                <p>{t('title_saveNow4')}</p>
                <div>
                    <p>{t('title_yourAccountKey')}</p>
                    <div className="passphrase">account key goes here Anri</div>
                </div>
                <Button icon="file_download" label={t('button_save')} className="gradient" />
            </div>
        );
    }
}

module.exports = SaveNow;
