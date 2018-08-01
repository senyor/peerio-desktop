const React = require('react');
const { observer } = require('mobx-react');
const { Checkbox } = require('peer-ui');
const { Button, Dropdown, MaterialIcon, Switch } = require('peer-ui');
const { t } = require('peerio-translator');
const T = require('~/ui/shared-components/T');
const { User, chatStore } = require('peerio-icebear');
const uiStore = require('~/stores/ui-store');
const { fileStore } = require('peerio-icebear');

const { action, observable } = require('mobx');
const sounds = require('~/helpers/sounds');

const TEST_SOUNDS = [
    { value: 'ack', label: 'ack' },
    { value: 'sending', label: 'sending' },
    { value: 'sent', label: 'sent' },
    { value: 'received', label: 'received' },
    { value: 'destroy', label: 'destroy' }
];

@observer
class Preferences extends React.Component {
    onMsgNotifChanged(ev) {
        User.current.settings.messageNotifications = ev.target.checked;
        User.current.saveSettings();
    }

    onErrorSoundsChanged(ev) {
        uiStore.prefs.errorSoundsEnabled = ev.target.checked;
    }

    onMentionSoundsChanged(ev) {
        uiStore.prefs.messageSoundsEnabled = false;
        uiStore.prefs.mentionSoundsEnabled = ev.target.checked;
    }

    onMessageSoundsChanged(ev) {
        if (ev.target.checked === true)
            uiStore.prefs.mentionSoundsEnabled = false;
        uiStore.prefs.messageSoundsEnabled = ev.target.checked;
    }

    onMentionDesktopNotificationsChanged(ev) {
        uiStore.prefs.messageDesktopNotificationsEnabled = false;
        uiStore.prefs.mentionDesktopNotificationsEnabled = ev.target.checked;
    }

    onMessageDesktopNotificationsChanged(ev) {
        if (ev.target.checked === true)
            uiStore.prefs.mentionDesktopNotificationsEnabled = false;
        uiStore.prefs.messageDesktopNotificationsEnabled = ev.target.checked;
    }

    onInviteDesktopNotificationsChanged(ev) {
        uiStore.prefs.inviteDesktopNotificationsEnabled = ev.target.checked;
    }

    @observable soundSelected = 'sending';

    @action.bound
    onSoundSelection(val) {
        this.soundSelected = val;
        this.playSound();
    }

    playSound = () => {
        sounds[this.soundSelected].play();
    };

    onUnreadChatSorting(ev) {
        chatStore.unreadChatsAlwaysOnTop = ev.target.checked;
        User.current.saveSettings();
    }

    onUrlPreviewToggle(ev) {
        uiStore.prefs.externalContentEnabled = ev.target.checked;
        if (!uiStore.prefs.externalContentConsented) {
            uiStore.prefs.externalContentConsented = true;
        }
    }

    onFavContactsPreviewToggle(ev) {
        uiStore.prefs.externalContentJustForFavs = ev.target.checked;
        if (!uiStore.prefs.externalContentConsented) {
            uiStore.prefs.externalContentConsented = true;
        }
    }

    onPeerioContentPreviewToggle(ev) {
        uiStore.prefs.peerioContentEnabled = ev.target.checked;
    }

    onInlineContentSizeLimitToggle(ev) {
        uiStore.prefs.limitInlineImageSize = !ev.target.checked;
    }

    render() {
        return (
            <div className="preferences">
                <section className="section-divider">
                    <T
                        k="title_emailNotifications"
                        tag="div"
                        className="title"
                    />
                    <T k="title_emailsDetail" tag="p" className="subheading" />
                    <Switch
                        checked={User.current.settings.messageNotifications}
                        label={t('title_notificationsEmailMessage')}
                        onChange={this.onMsgNotifChanged}
                    />
                </section>
                <section className="section-divider prefs-sounds">
                    <T
                        k="title_soundNotifications"
                        tag="div"
                        className="title"
                    />
                    <T k="title_soundsDetail" tag="p" className="subheading" />
                    <Switch
                        checked={uiStore.prefs.messageSoundsEnabled}
                        label={t('title_soundsMessage')}
                        onChange={this.onMessageSoundsChanged}
                    />
                    <Switch
                        checked={uiStore.prefs.mentionSoundsEnabled}
                        disabled={this.mentionSoundsSwitchDisabled}
                        label={t('title_soundsMention')}
                        onChange={this.onMentionSoundsChanged}
                    />
                    <Switch
                        checked={uiStore.prefs.errorSoundsEnabled}
                        label={t('title_soundsError')}
                        onChange={this.onErrorSoundsChanged}
                    />

                    <T
                        k="title_soundSelectHeader"
                        tag="p"
                        className="subheading sound-selection-heading"
                    />
                    <div className="sound-selection-container">
                        <Dropdown
                            options={TEST_SOUNDS}
                            onChange={this.onSoundSelection}
                            value={this.soundSelected}
                        />
                        <Button onClick={this.playSound}>
                            <T k="title_preview" />
                        </Button>
                    </div>
                </section>
                <section className="section-divider">
                    <T
                        k="title_desktopNotifications"
                        tag="div"
                        className="title"
                    />
                    <T
                        k="title_desktopNotificationsDetail"
                        tag="p"
                        className="subheading"
                    />
                    <Switch
                        checked={
                            uiStore.prefs.messageDesktopNotificationsEnabled
                        }
                        label={t('title_messageDesktopNotificationsMessage')}
                        onChange={this.onMessageDesktopNotificationsChanged}
                    />
                    <Switch
                        checked={
                            uiStore.prefs.mentionDesktopNotificationsEnabled
                        }
                        label={t('title_mentionDesktopNotificationsMessage')}
                        disabled={
                            this.mentionDesktopNotificationsSwitchDisabled
                        }
                        onChange={this.onMentionDesktopNotificationsChanged}
                    />
                    <Switch
                        checked={
                            uiStore.prefs.inviteDesktopNotificationsEnabled
                        }
                        label={t('title_inviteDesktopNotificationsMessage')}
                        onChange={this.onInviteDesktopNotificationsChanged}
                    />
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
                    <T
                        k="title_displayPreferences"
                        tag="div"
                        className="title"
                    />
                    <T
                        k="title_imageFilePreviews"
                        tag="p"
                        className="subheading"
                    />
                    <Switch
                        className="narrow"
                        label={t('title_showImagePreviews')}
                        checked={uiStore.prefs.peerioContentEnabled}
                        onChange={this.onPeerioContentPreviewToggle}
                    />
                    <T
                        k="title_showImagePreviewsDescription2"
                        tag="p"
                        className="narrow smalltext"
                    />
                    <Switch
                        className="narrow"
                        label={t('title_showLargeImages', {
                            size: fileStore.inlineImageSizeLimitFormatted
                        })}
                        checked={!uiStore.prefs.limitInlineImageSize}
                        onChange={this.onInlineContentSizeLimitToggle}
                    />
                    <T
                        k="title_imageTooBigCutoff"
                        tag="p"
                        className="narrow smalltext"
                    >
                        {{
                            size: fileStore.inlineImageSizeLimitCutoffFormatted
                        }}
                    </T>
                </section>
                <section className="section-divider prefs-url">
                    <p className="subheading">{t('title_urlPreview')}</p>
                    <div className="warning">
                        <MaterialIcon icon="security" />
                        <div>
                            <T k="title_EnableUrlPreviewWarning" />&nbsp;
                            <T k="title_learnMore" />
                        </div>
                    </div>
                    <Switch
                        label={t('title_EnableUrlPreviews')}
                        checked={uiStore.prefs.externalContentEnabled}
                        onChange={this.onUrlPreviewToggle}
                    />
                    <Checkbox
                        label={t('title_onlyFromFavourites')}
                        checked={uiStore.prefs.externalContentJustForFavs}
                        onChange={this.onFavContactsPreviewToggle}
                    />
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
