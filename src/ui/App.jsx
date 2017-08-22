const React = require('react');
const AppNav = require('~/ui/AppNav');
const uiStore = require('~/stores/ui-store');
const { Dialog } = require('~/react-toolbox');
const { t } = require('peerio-translator');
const ContactProfile = require('~/ui/contact/components/ContactProfile');
const { observer } = require('mobx-react');
const { observable } = require('mobx');

@observer
class App extends React.Component {
    // for smooth dialog hiding, without this it will render empty dialog while hiding it
    @observable contactDialogHiding = false;
    hideContactDialog = () => {
        this.contactDialogHiding = true;

        setTimeout(() => {
            uiStore.contactDialogUsername = null;
            this.contactDialogHiding = false;
        }, 500);
    };

    get signatureErrorDialog() {
        const hide = uiStore.hideFileSignatureErrorDialog;
        const dialogActions = [
            { label: t('button_dismiss'), onClick: hide }
        ];
        return (
            <Dialog
                active={uiStore.isFileSignatureErrorDialogActive}
                actions={dialogActions}
                onOverlayClick={hide}
                onEscKeyDown={hide}
                title={t('title_invalidFileSignature')}
                className="dialog-warning">
                <p>{t('error_invalidFileSignatureLong')}</p>
            </Dialog>
        );
    }

    componentWillMount() {
        uiStore.init();
    }

    render() {
        const contactDialogActions = [
            { label: t('button_close'), onClick: this.hideContactDialog }
        ];

        return (
            <div className="flex-row app-root">
                <AppNav />
                {this.props.children}
                <Dialog active={!this.contactDialogHiding && !!uiStore.contactDialogUsername}
                    actions={contactDialogActions} onOverlayClick={this.hideContactDialog}
                    onEscKeyDown={this.hideContactDialog}
                    title={t('title_settingsProfile')}>
                    {
                        uiStore.contactDialogUsername
                            ? <ContactProfile username={uiStore.contactDialogUsername}
                                onClose={this.hideContactDialog} />
                            : null
                    }
                </Dialog>
                {this.signatureErrorDialog}
            </div>
        );
    }
}

module.exports = App;
