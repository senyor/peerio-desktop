const React = require('react');
const { observable } = require('mobx');
const { observer } = require('mobx-react');
const { Switch } = require('~/react-toolbox');
const { t } = require('peerio-translator');
const { User, chatStore } = require('~/icebear');
const uiStore = require('~/stores/ui-store');

@observer
class Preferences extends React.Component {
    @observable mentionSoundsSwitchDisabled = false;
    @observable mentionDesktopNotificationsSwitchDisabled = false;

    onMsgNotifChanged = (value) => {
        User.current.settings.messageNotifications = value;
        User.current.saveSettings();
    }

    onErrorSoundsChanged = (value) => {
        uiStore.prefs.errorSoundsEnabled = value;
    }

    onMentionSoundsChanged = (value) => {
        if (value === false) uiStore.prefs.messageSoundsEnabled = false;
        uiStore.prefs.mentionSoundsEnabled = value;
    }

    onMessageSoundsChanged = (value) => {
        if (value === true) uiStore.prefs.mentionSoundsEnabled = false;
        this.mentionSoundsSwitchDisabled = value;
        uiStore.prefs.messageSoundsEnabled = value;
    }

    onMentionDesktopNotificationsChanged = (value) => {
        if (value === false) uiStore.prefs.messageDesktopNotificationsEnabled = false;
        uiStore.prefs.mentionDesktopNotificationsEnabled = value;
    }

    onMessageDesktopNotificationsChanged = (value) => {
        if (value === true) uiStore.prefs.mentionDesktopNotificationsEnabled = false;
        this.mentionDesktopNotificationsSwitchDisabled = value;
        uiStore.prefs.messageDesktopNotificationsEnabled = value;
    }

    onUnreadChatSorting = (value) => {
        chatStore.unreadChatsAlwaysOnTop = value;
        User.current.saveSettings();
    }

    render() {
        return (
            <div>
                <section className="section-divider">
                    <div className="title">{t('title_emailNotifications')}</div>
                    <p>
                        {t('title_emailsDetail')}
                    </p>
                    <Switch checked={User.current.settings.messageNotifications}
                        label={t('title_notificationsEmailMessage')}
                        onChange={this.onMsgNotifChanged} />
                </section>
                <section className="section-divider">
                    <div className="title">{t('title_soundNotifications')}</div>
                    <p>
                        {t('title_soundsDetail')}
                    </p>
                    <Switch checked={uiStore.prefs.messageSoundsEnabled}
                        label={t('title_soundsMessage')}
                        onChange={this.onMessageSoundsChanged} />
                    <Switch checked={uiStore.prefs.mentionSoundsEnabled}
                        disabled={this.mentionSoundsSwitchDisabled}
                        label={t('title_soundsMention')}
                        onChange={this.onMentionSoundsChanged} />
                    <Switch checked={uiStore.prefs.errorSoundsEnabled}
                        label={t('title_soundsError')}
                        onChange={this.onErrorSoundsChanged} />
                </section>
                <section className="section-divider">
                    <div className="title">{t('title_desktopNotifications')}</div>
                    <p>
                        {t('title_desktopNotificationsDetail')}
                    </p>
                    <Switch checked={uiStore.prefs.messageDesktopNotificationsEnabled}
                        label={t('title_messageDesktopNotificationsMessage')}
                        onChange={this.onMessageDesktopNotificationsChanged} />
                    <Switch checked={uiStore.prefs.mentionDesktopNotificationsEnabled}
                        label={t('title_mentionDesktopNotificationsMessage')}
                        disabled={this.mentionDesktopNotificationsSwitchDisabled}
                        onChange={this.onMentionDesktopNotificationsChanged} />
                </section>
                <section className="section-divider">
                    <div className="title">{t('title_displayPreferences')}</div>
                    <Switch checked={chatStore.unreadChatsAlwaysOnTop}
                        label={t('title_unreadChatsOnTopDetail')}
                        onChange={this.onUnreadChatSorting} />
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
