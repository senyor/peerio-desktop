const React = require('react');
const { observable } = require('mobx');
const { observer } = require('mobx-react');
const { Switch } = require('~/react-toolbox');
const { t } = require('peerio-translator');
const { User } = require('~/icebear');
const uiStore = require('~/stores/ui-store');

@observer
class Account extends React.Component {

    onPromoSubscriptionChanged = (value) => {
        User.current.settings.subscribeToPromoEmails = value;
        User.current.saveSettings();
    }

    onErrorTrackingChanged = (value) => {
        User.current.settings.errorTracking = value;
        User.current.saveSettings();
    }

    onDataCollectionChanged = (value) => {
        User.current.settings.dataCollection = value;
        User.current.saveSettings();
    }

    render() {
        return (
            <div>
                <section className="section-divider">
                    <div className="title">{t('title_promoConsentRequestTitle')}</div>
                    <Switch checked={User.current.settings.subscribeToPromoEmails}
                        label={t('title_promoConsent')}
                        onChange={this.onPromoSubscriptionChanged} />
                </section>
                <section className="section-divider">
                    <div className="title">{t('title_dataPreferences')}</div>
                    <p>
                        {t('title_dataDetail')}
                    </p>
                    <Switch checked={User.current.settings.errorTracking}
                        label={t('title_errorTrackingMessage')}
                        onChange={this.onErrorTrackingChanged} />
                    <Switch checked={User.current.settings.dataCollection}
                        label={t('title_dataCollectionMessage')}
                        onChange={this.onDataCollectionChanged} />
                </section>

            </div>
        );
    }
}
/*
 <section>
     <div className="title">{t('title_privacy')}</div>
     <p>
         {t('title_privacyDetail')}
                         </p>
     <Switch checked="true" label={t('title_never')} />
     <Switch checked="false" label={t('title_yourName')} />
     <Switch checked="false" label={t('title_yourUsername')} />
     <Switch checked="false" label={t('title_yourEmail')} />
 </section>
*/

module.exports = Account;
