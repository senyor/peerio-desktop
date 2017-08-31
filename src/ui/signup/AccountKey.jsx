const React = require('react');
const { Component } = require('react');
const { observer } = require('mobx-react');
const { Button, IconButton } = require('~/react-toolbox');
const { clipboard } = require('electron').remote;
const PDFSaver = require('~/ui/shared-components/PDFSaver');
const AvatarControl = require('./AvatarControl');
const { t } = require('peerio-translator');
const T = require('~/ui/shared-components/T');


@observer class AccountKey extends Component {
    handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            this.props.returnHandler();
        }
    };

    backupAccountKey = () => {
        const { username, email, passphrase } = this.props.store;
        const tplVars = {
            username,
            email,
            key: passphrase
        };

        this.pdfSaver.save(tplVars, `${username}.pdf`);

        // NOTICE: user can press cancel and this flag would still be set to true
        this.props.store.keyBackedUp = true;
    };

    render() {
        const { store: { passphrase, temporaryAvatarFileName } } = this.props;
        return (
            <div className="flex-col">
                <div className="profile">
                    {/* FIXME: This should be switch for uploaded Avatar or First/Last Avatar */}
                    <AvatarControl fileName={temporaryAvatarFileName} />
                    <p>Passwords are way stronger when computers make them. This Account Key was generated just for you. Beep boop.
                    </p>
                    <div className="account-key-wrapper">
                        <div className="label">Your Account Key</div>
                        <div className="flex-row flex-align-center">
                            <div className="account-key">{passphrase}</div>
                            <IconButton icon="content_copy"
                                onClick={() => clipboard.writeText(passphrase)} />
                        </div>
                    </div>
                    <p>Since Peerio cannot access any of your data, including this Account Key, saving a backup may help you in the future.
                    </p>
                    <Button label="save account key pdf" icon="file_download" raised onClick={this.backupAccountKey} />
                    <PDFSaver ref={ref => { this.pdfSaver = ref; }} template="./AccountKeyBackup.html" />
                </div>
            </div>
        );
    }
}

module.exports = AccountKey;
