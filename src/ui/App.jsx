const React = require('react');
const AppNav = require('~/ui/AppNav');
const uiStore = require('~/stores/ui-store');
const { Dialog, ProgressBar, Checkbox } = require('~/react-toolbox');
const { t } = require('peerio-translator');
const ContactProfile = require('~/ui/contact/components/ContactProfile');
const { observer } = require('mobx-react');
const { observable, action } = require('mobx');
const { clientApp, User } = require('~/icebear');
const T = require('~/ui/shared-components/T');

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

    shareUsageDialogActions = [
        { label: t('button_ok'), onClick: this.hideShareUsageDialog }
    ];

    hideShareUsageDialog = () => {
        uiStore.prefs.dataCollectionPromptShown = true;
    }

    @action onToggleShareUsage() {
        User.current.settings.dataCollection = !User.current.settings.dataCollection;
        User.current.settings.errorTracking = !User.current.settings.errorTracking;
    }

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
            <div className="app-root">
                <AppNav />
                {clientApp.updatingAfterReconnect
                    ? <div className="global-update-progress"><ProgressBar type="linear" mode="indeterminate" /></div>
                    : null}

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
                <Dialog
                    active={User.current.settings.shouldPromptDataCollection && !uiStore.prefs.dataCollectionPromptShown}
                    actions={this.shareUsageDialogActions}
                    onOverlayClick={this.hideShareUsageDialog}
                    onEscKeyDown={this.hideShareUsageDialog}
                    title={t('title_shareUsage')}>
                    <T k="title_shareUsageDetails" />
                    <Checkbox
                        checked={User.current.settings.dataCollection && User.current.settings.errorTracking}
                        label={t('button_shareUsage')}
                        onChange={this.onToggleShareUsage}
                    />
                </Dialog>
                {this.signatureErrorDialog}
            </div>
        );
    }
}

module.exports = App;
