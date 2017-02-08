const React = require('react');
const AppNav = require('~/ui/AppNav');
const Snackbar = require('~/ui/shared-components/Snackbar');
const uiStore = require('~/stores/ui-store');
const { Dialog } = require('~/react-toolbox');
const { t } = require('peerio-translator');
const ContactProfile = require('~/ui/contact/ContactProfile');
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

    contactDialogActions = [
        { label: t('cancel'), onClick: this.hideContactDialog }
    ];

    render() {
        return (
            <div className="flex-row app-root">
                <AppNav />
                {this.props.children}
                <Snackbar location="app" />
                <Dialog active={!this.contactDialogHiding && !!uiStore.contactDialogUsername}
                        actions={this.contactDialogActions} onOverlayClick={this.hideContactDialog}
                        onEscKeyDown={this.hideContactDialog}
                        title={t('profile')}>
                    {
                        uiStore.contactDialogUsername
                        ? <ContactProfile username={uiStore.contactDialogUsername} />
                        : null
                    }
                </Dialog>
            </div>
        );
    }
}

module.exports = App;
