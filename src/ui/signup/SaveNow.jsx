const React = require('react');
const { Component } = require('react');
const { observable, computed } = require('mobx');
const { observer } = require('mobx-react');
const { Button } = require('~/react-toolbox');
const { socket, validation } = require('~/icebear');
const { t } = require('peerio-translator');
const languageStore = require('~/stores/language-store');
const fs = require('fs');
const electron = require('electron').remote;

const { validators } = validation; // use common validation from core

@observer class SaveNow extends Component {

    wwref = (ref) => {
        this.ref = ref;
    }
    // TODO: this is duplicated with Security settings, FIX IT
    save = () => {
        const store = this.props.store;
        this.replaceTemplateVars(store.username, store.email, store.passphrase, () => {
            const win = electron.getCurrentWindow();
            electron.dialog.showSaveDialog(win, { defaultPath: `${store.username}.pdf` }, this.printToPdf);
        });
    };

    replaceTemplateVars(username, email, key, callback) {
        const js = `
            document.getElementById('username').innerHTML = '${username}';
            document.getElementById('email').innerHTML = '${email}';
            document.getElementById('key').innerHTML = '${key}';
            `;
        this.ref.executeJavaScript(js, true, callback);
    }

    printToPdf = (filePath) => {
        if (!filePath) return;
        this.ref.printToPDF({ printBackground: true, landscape: false }, (er, data) => {
            fs.writeFileSync(filePath, data);
        });
    };

    render() {
        return (
            <div className="flex-col profile">
                <div className="warning-line">
                    <div className="flex-col flex-justify-center" style={{ width: '275px', whiteSpace: 'nowrap' }}>
                        <span className="display-1">{t('title_saveNow1')}</span>
                        <strong className="display-2">{t('title_saveNow2')}</strong>
                    </div>
                </div>
                <p>{t('title_saveNow3')}</p>
                <p>{t('title_saveNow4')}</p>
                {/* <div>
                    <p>{t('title_yourAccountKey')}</p>
                    <div className="passphrase">{this.props.store.passphrase}</div>
                </div> */}

                <Button icon="file_download"
                    label={t('button_saveAccountKey')}
                    className="button-gradient"
                    style={{ marginTop: '32px' }}
                    onClick={this.save} />
                <webview ref={this.wwref} src="./AccountKeyBackup.html"
                    style={{ display: 'inline-flex', width: 0, height: 0, flex: '0 1' }} />
            </div>
        );
    }
}

module.exports = SaveNow;
