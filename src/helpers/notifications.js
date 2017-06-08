const sounds = require('~/helpers/sounds');
const uiStore = require('../stores/ui-store');
const appState = require('../stores/app-state');
const { t } = require('peerio-translator');
const path = require('path');
const { app } = require('electron').remote;
const config = require('~/config');

const notifications = {};
class MessageNotification {
    constructor(props) {
        this.chat = props.chat;
        this.lastMessageText = props.lastMessageText;
        this.counter = props.unreadCount;
        this.translationKeyword = 'Messages';
        this.userDesktopNotificationCondition = uiStore.prefs.messageDesktopNotificationsEnabled;
        this.userSoundsCondition = uiStore.prefs.messageSoundsEnabled;
    }

    send() {
        console.log('condition', this.userDesktopNotificationCondition);
        if (this.userDesktopNotificationCondition) this.showDesktopNotification();
        if (this.userSoundsCondition) this.playSound();
    }

    showDesktopNotification() {
        if (!appState.isFocused) {
            let body = this.lastMessageText;
            if (this.counter >= config.chat.pageSize) {
                body = t(`notification_manyNew${this.translationKeyword}`);
            }
            if (this.counter > 1) {
                body = t(`notification_new${this.translationKeyword}`, { count: this.counter });
            }
            this.postDesktopNotification(
                this.chat.name,
                body
            );
        }
    }

    playSound() {
        sounds.received.play();
    }

    postDesktopNotification(title, body) {
        if (!title || !body) return;
        // replace existing notification -- only one per chat
        if (notifications[this.chat.id]) {
            notifications[this.chat.id].close();
        }
        const props = {
            body,
            silent: true
        };

        // icon needed for Windows, looks weird on Mac
        if (config.os !== 'Darwin') props.icon = path.join(app.getAppPath(), 'build/static/img/notification-icon.png');

        notifications[this.chat.id] = new Notification(
            title,
            props
        );
    }
}

class MentionNotification extends MessageNotification {
    constructor(props) {
        super(props);
        this.userDesktopNotificationCondition = uiStore.prefs.mentionDesktopNotificationsEnabled;
        this.userSoundsCondition = uiStore.prefs.mentionSoundsEnabled;
        this.translationKeyword = 'Mentions';
        this.counter = this.unreadCount > config.chat.pageSize ? this.unreadCount : this.freshBatchMentionCount;
    }
}

class DMNotification extends MessageNotification {
    constructor(props) {
        super(props);
        this.userDesktopNotificationCondition = uiStore.prefs.mentionDesktopNotificationsEnabled;
        this.userSoundsCondition = uiStore.prefs.mentionSoundsEnabled;
        this.translationKeyword = 'DMs';
        this.counter = this.unreadCount > config.chat.pageSize ? this.unreadCount : this.freshBatchMentionCount;
    }
}

function send(props) {
    if (props.chat.participants.length <= 1) {
        const m = new DMNotification(props);
        m.send();
    } else if (props.freshBatchMentionCount) {
        const m = new MentionNotification(props);
        m.send();
    }
    const m = new MessageNotification(props);
    m.send();
}

module.exports = {
    send
};
