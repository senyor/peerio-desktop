const React = require('react');
const { observer } = require('mobx-react');
const { Switch } = require('~/react-toolbox');
const { t } = require('peerio-translator');
const { User, chatStore } = require('~/icebear');
const uiStore = require('~/stores/ui-store');

@observer
class Preferences extends React.Component {
    onMsgNotifChanged(value) {
        User.current.settings.messageNotifications = value;
        User.current.saveSettings();
    }
    onSoundsChanged(value) {
        uiStore.soundsEnabled = value;
    }
    onUnreadChatSorting(value) {
        chatStore.unreadChatsAlwaysOnTop = value;
        User.current.saveSettings();
    }

    onErrorTrackingChanged(value) {
        User.current.settings.errorTracking = value;
        User.current.saveSettings();
    }

    onDataCollectionChanged(value) {
        User.current.settings.dataCollection = value;
        User.current.saveSettings();
    }

    render() {
        return (
            <div>
                <section className="section-divider">
                    <div className="title">{t('title_notifications')}</div>
                    <p>
                        {t('title_notificationsDetail')}
                    </p>
                    <Switch checked={User.current.settings.messageNotifications}
                        label={t('title_notificationsMessage')}
                        onChange={this.onMsgNotifChanged} />
                    <Switch checked={uiStore.soundsEnabled}
                        label={t('title_notificationsMessage')}
                        onChange={this.onSoundsChanged} />
                    <Switch checked={User.current.settings.subscribeToPromoEmails}
                        label={t('title_promoConsent')}
                        onChange={this.onPromoSubscriptionChanged} />
                </section>
                <section className="section-divider">
                    <div className="title">{t('title_displayPreferences')}</div>
                    <p>
                        {t('title_unreadChatsOnTopDetail')}
                    </p>
                    <Switch checked={chatStore.unreadChatsAlwaysOnTop}
                        label={t('title_unreadChatsOnTopDetail')}
                        onChange={this.onUnreadChatSorting} />
                </section>
                <section className="section-divider">
                    <div className="title">{t('title_dataPreferences')}</div>
                    <p>
                        {t('title_dataDetail')}
                    </p>
                    <Switch checked={uiStore.errorTrackingEnabled}
                        label={t('title_errorTrackingMessage')}
                        onChange={this.onErrorTrackingChanged} />
                    <Switch checked={uiStore.dataCollectionEnabled}
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

module.exports = Preferences;
