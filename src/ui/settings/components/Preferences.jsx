const React = require('react');
const { observer } = require('mobx-react');
const { Checkbox, FontIcon, Switch } = require('~/react-toolbox');
const { t } = require('peerio-translator');
const { User, chatStore } = require('~/icebear');
const uiStore = require('~/stores/ui-store');

@observer
class Preferences extends React.Component {
    onMsgNotifChanged(value) {
        User.current.settings.messageNotifications = value;
        User.current.saveSettings();
    }

    onErrorSoundsChanged(value) {
        uiStore.prefs.errorSoundsEnabled = value;
    }

    onMentionSoundsChanged(value) {
        uiStore.prefs.messageSoundsEnabled = false;
        uiStore.prefs.mentionSoundsEnabled = value;
    }

    onMessageSoundsChanged(value) {
        if (value === true) uiStore.prefs.mentionSoundsEnabled = false;
        uiStore.prefs.messageSoundsEnabled = value;
    }

    onMentionDesktopNotificationsChanged(value) {
        uiStore.prefs.messageDesktopNotificationsEnabled = false;
        uiStore.prefs.mentionDesktopNotificationsEnabled = value;
    }

    onMessageDesktopNotificationsChanged(value) {
        if (value === true) uiStore.prefs.mentionDesktopNotificationsEnabled = false;
        uiStore.prefs.messageDesktopNotificationsEnabled = value;
    }

    onUnreadChatSorting(value) {
        chatStore.unreadChatsAlwaysOnTop = value;
        User.current.saveSettings();
    }

    onUrlPreviewToggle(value) {
        uiStore.prefs.externalContentEnabled = value;
        if (!uiStore.prefs.externalContentConsented) {
            uiStore.prefs.externalContentConsented = true;
        }
    }

    onFavContactsPreviewToggle(value) {
        uiStore.prefs.externalContentJustForFavs = value;
        if (!uiStore.prefs.externalContentConsented) {
            uiStore.prefs.externalContentConsented = true;
        }
    }

    onPeerioContentPreviewToggle(value) {
        uiStore.prefs.peerioContentEnabled = value;
    }

    onInlineContentSizeLimitToggle(value) {
        uiStore.prefs.limitInlineImageSize = !value;
    }

    render() {
        return (
            <div className="preferences">
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
                {/* <section className="section-divider prefs-files">
                    <div className="title">{t('title_files')}</div>
                    <div className="files-location-container">
                        <p className="narrow">{t('title_fileDownloadLocation')}</p>
                        <div className="file-location">
                            <span>Users/.../Work/Downloads/ThisIsTheprojectNameFile</span>
                            <Button>CHANGE</Button>
                        </div>
                    </div>
                </section>
        */}
                <section className="section-divider prefs-display">
                    <div className="title">{t('title_displayPreferences')}</div>
                    <p className="subheading">{t('title_imageFilePreviews')}</p>
                    <Switch className="narrow" label={t('title_showImagePreviews')}
                        checked={uiStore.prefs.peerioContentEnabled}
                        onChange={this.onPeerioContentPreviewToggle} />
                    <p className="narrow smalltext">{t('title_showImagePreviewsDescription2')}</p>
                    <Switch label={t('title_showLargeImages10MB')}
                        checked={!uiStore.prefs.limitInlineImageSize}
                        onChange={this.onInlineContentSizeLimitToggle} />
                </section>
                <section className="section-divider prefs-url">
                    <p className="subheading">{t('title_urlPreview')}</p>
                    <div className="warning">
                        <FontIcon value="security" />
                        <div>
                            <span>{t('title_EnableUrlPreviewWarning')}&nbsp;</span>
                            <a href="https://peerio.zendesk.com/hc/en-us/articles/115005090766">
                                {t('title_learnMore')}
                            </a>
                        </div>
                    </div>
                    <Switch label={t('title_EnableUrlPreviews')}
                        checked={uiStore.prefs.externalContentEnabled}
                        onChange={this.onUrlPreviewToggle} />
                    <Checkbox label={t('title_onlyFromFavourites')}
                        checked={uiStore.prefs.externalContentJustForFavs}
                        onChange={this.onFavContactsPreviewToggle} />
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
