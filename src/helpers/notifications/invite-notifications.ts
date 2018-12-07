import path from 'path';
import { when } from 'mobx';
import { remote as electron } from 'electron';

import { contactStore, chatStore, chatInviteStore, t } from 'peerio-icebear';
import { Contact } from 'peerio-icebear/dist/models';

import sounds from '~/helpers/sounds';
import uiStore from '~/stores/ui-store';
import appState from '~/stores/app-state';
import routerStore from '~/stores/router-store';
import config from '~/config';

import { bringAppToFront } from './helpers';

const { app } = electron;

interface ReceivedInvite {
    username: string;
    channelName: string;
    kegDbId: string;
}

interface InviteNotificationInit {
    invite: ReceivedInvite;
}

class InviteNotification {
    invite: ReceivedInvite;
    userDesktopNotificationCondition: boolean;
    userSoundsCondition: boolean;

    constructor(props: InviteNotificationInit) {
        this.invite = props.invite;
        this.userDesktopNotificationCondition = uiStore.prefs.inviteDesktopNotificationsEnabled;
        this.userSoundsCondition = uiStore.prefs.messageSoundsEnabled;
    }

    send() {
        if (this.userDesktopNotificationCondition) this.showDesktopNotification();
        if (this.userSoundsCondition) this.playSound();
    }

    showDesktopNotification() {
        if (!appState.isFocused) {
            const { username, channelName } = this.invite;
            const contact = contactStore.getContact(username);
            when(
                () => !contact.loading,
                () => {
                    this.postDesktopNotification(
                        t('notification_roomInviteTitle'),
                        t('notification_roomInviteBody', {
                            name: contact.fullName,
                            room: channelName
                        })
                    );
                }
            );
        }
    }

    playSound() {
        sounds.received.play();
    }

    handleClick = () => {
        if (this.invite) {
            bringAppToFront();

            // Activate invite
            // "when" is needed because notification can arrive and be clicked
            // before chatStore is loaded, which causes lots of confusion in UI.
            when(
                () => chatStore.loaded,
                () => {
                    chatInviteStore.activateInvite(this.invite.kegDbId);
                    if (chatInviteStore.activeInvite) {
                        chatStore.deactivateCurrentChat();
                        routerStore.navigateTo(routerStore.ROUTES.channelInvite);
                    }
                }
            );
        }
    };

    postDesktopNotification(title: string, body: string) {
        if (!title || !body) return;
        const props: NotificationOptions = {
            body,
            silent: true
        };

        // icon needed for Windows, looks weird on Mac
        if (config.os !== 'Darwin')
            props.icon = path.join(app.getAppPath(), 'build/static/img/notification-icon.png');

        const notification = new Notification(title, props);
        notification.onclick = this.handleClick;
    }
}

export function sendInviteNotification(props: InviteNotificationInit) {
    const n = new InviteNotification(props);
    n.send();
}

interface InviteAcceptedNotificationInit {
    contact: Contact;
}

// TODO: all of these notification classes are very similar, can we abstract them?
class InviteAcceptedNotification {
    contact: Contact;
    userDesktopNotificationCondition: boolean;
    userSoundsCondition: boolean;

    constructor(props: InviteAcceptedNotificationInit) {
        this.contact = props.contact;
        this.userDesktopNotificationCondition = true; // TODO: for now this notif is always on
        this.userSoundsCondition = uiStore.prefs.messageSoundsEnabled;
    }

    send() {
        if (this.userDesktopNotificationCondition) this.showDesktopNotification();
        if (this.userSoundsCondition) this.playSound();
    }

    showDesktopNotification() {
        if (!appState.isFocused) {
            const { username } = this.contact;
            if (!username) return;
            const contact = contactStore.getContact(username);

            this.postDesktopNotification(
                t('notification_inviteAcceptedTitle'),
                t('notification_inviteAcceptedBody', {
                    firstName: contact.firstName || '',
                    username
                })
            );
        }
    }

    playSound() {
        sounds.received.play();
    }

    postDesktopNotification(title: string, body: string) {
        if (!title || !body) return;
        const props: NotificationOptions = {
            body,
            silent: true
        };

        // icon needed for Windows, looks weird on Mac
        if (config.os !== 'Darwin') {
            props.icon = path.join(app.getAppPath(), 'build/static/img/notification-icon.png');
        }
        new Notification(title, props); // eslint-disable-line no-new
    }
}

export function sendInviteAcceptedNotification(props: InviteAcceptedNotificationInit) {
    const n = new InviteAcceptedNotification(props);
    n.send();
}

export function sendWindowHiddenNotification() {
    const props: NotificationOptions = {
        body: t('notification_peerioInTrayBody'),
        silent: true
    };

    // icon needed for Windows, looks weird on Mac
    if (config.os !== 'Darwin') {
        props.icon = path.join(app.getAppPath(), 'build/static/img/notification-icon.png');
    }
    new Notification(t('notification_peerioInTrayTitle'), props); // eslint-disable-line no-new
}
