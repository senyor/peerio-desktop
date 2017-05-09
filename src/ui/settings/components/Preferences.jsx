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
                </section>
                <section className="section-divider">
                    <div className="title">{t('title_sounds')}</div>
                    <p>
                        {t('title_soundsDetail')}
                    </p>
                    <Switch checked={uiStore.soundsEnabled}
                        label={t('title_notificationsMessage')}
                        onChange={this.onSoundsChanged} />
                </section>
                <section className="section-divider">
                    <Switch checked={chatStore.unreadChatsAlwaysOnTop}
                        label={t('title_unreadChatsOnTop')}
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
