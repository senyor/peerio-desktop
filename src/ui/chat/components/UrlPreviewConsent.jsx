const React = require('react');
const { observable } = require('mobx');
const { observer } = require('mobx-react');
const css = require('classnames');
const { t } = require('peerio-translator');
const { Button, FontIcon, RadioGroup, RadioButton } = require('~/react-toolbox');
const uiStore = require('~/stores/ui-store');
const routerStore = require('~/stores/router-store');
const T = require('~/ui/shared-components/T');

const ALL_CONTACTS = 'all_contacts';
const FAV_CONTACTS = 'fav_contacts';
const DISABLED = 'disabled';

@observer
class UrlPreviewConsent extends React.Component {
    @observable selectedMode = ALL_CONTACTS;
    @observable firstSave = false;

    onSelectedModeChange = (value) => {
        this.selectedMode = value;
    }

    onDismiss = () => {
        this.selectedMode = DISABLED;
        this.onSubmitConsent();
    }

    onSubmitConsent = () => {
        this.firstSave = true;
        uiStore.prefs.externalContentConsented = true;
        switch (this.selectedMode) {
            case ALL_CONTACTS:
                uiStore.prefs.externalContentEnabled = true;
                uiStore.prefs.externalContentJustForFavs = false;
                break;
            case FAV_CONTACTS:
                uiStore.prefs.externalContentEnabled = true;
                uiStore.prefs.externalContentJustForFavs = true;
                break;
            default:
                uiStore.prefs.externalContentEnabled = false;
                break;
        }
    }

    goToSettings = () => {
        routerStore.navigateTo(routerStore.ROUTES.prefs);
    }

    render() {
        // need to erase this for now bc urlData is empty, which iss the reason for shifting consent to new component
        // const urlData = this.props.urlData;

        const textParser = {
            toSettings: text => <a className="clickable" onClick={this.goToSettings}>{text}</a>
        };

        return (
            <div className="url-consent first-time">
                <div className="warning-header">
                    <FontIcon value="security" />
                    <T k="title_EnableUrlPreviews" className="text" />
                </div>
                <div className="warning-body">
                    <p className="text">
                        <T k="title_UrlPreviewsWarning2" />&nbsp;
                        <T k="title_learnMore" />
                    </p>
                    <RadioGroup
                        className="options"
                        name="option"
                        value={this.selectedMode}
                        onChange={this.onSelectedModeChange}>
                        <RadioButton label={t('title_forAllContacts')} value={ALL_CONTACTS} />
                        <RadioButton label={t('title_forFavouriteContactsOnly')} value={FAV_CONTACTS} />
                        <RadioButton label={t('title_disable')} value={DISABLED} />
                    </RadioGroup>

                    <div className="buttons-container">
                        <Button className="notnow" onClick={this.onDismiss}>{t('button_notNow')}</Button>
                        <Button className="save" onClick={this.onSubmitConsent}>{t('button_save')}</Button>
                    </div>
                </div>
                { this.firstSave &&
                    <div className={css('update-settings', { nomargin: !uiStore.prefs.externalContentEnabled })}>
                        <FontIcon value="check_circle" />
                        <T k="title_updateSettingsAnyTime" className="text">{textParser}</T>
                    </div>
                }
            </div>
        );
    }
}


module.exports = UrlPreviewConsent;
