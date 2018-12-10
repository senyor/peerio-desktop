import { remote as electron } from 'electron';
import { socket } from 'peerio-icebear';
import { when } from 'mobx';
import IdleMonitor from './idle-monitor';
import appState from '../stores/app-state';

/*
  When we receive power event there can be 3 cases:

  - We are authenticated (or at least we think we are, hehe) so we send the message.
  - We are disconnected, so whatever, server doesn't care anymore about our connection state.
  - We are connected, but not authenticated yet, can't even send the message.
 */

let enablePushAuthDisposer = null;
let disablePushAuthDisposer = null;

function enablePushNotification() {
    if (disablePushAuthDisposer) {
        disablePushAuthDisposer();
        disablePushAuthDisposer = null;
    }
    if (enablePushAuthDisposer) return;
    enablePushAuthDisposer = when(
        () => socket.authenticated,
        async () => {
            try {
                await socket.send('/auth/push/enable');
                console.log('Enabled push notifications.');
            } catch (err) {
                console.error(err);
                console.log('Failed to enable push notifications.');
            }
            enablePushAuthDisposer = null;
        }
    );
}

function disablePushNotifications() {
    if (enablePushAuthDisposer) {
        enablePushAuthDisposer();
        enablePushAuthDisposer = null;
    }
    if (disablePushAuthDisposer) return;

    disablePushAuthDisposer = when(
        () => socket.authenticated,
        async () => {
            try {
                // Short timeout will let us avoid long lags in connection that happen after sleep.
                await socket.send('/auth/push/disable').timeout(3000);
                console.log('Disabled push notifications.');
                disablePushAuthDisposer = null;
            } catch (err) {
                console.error(err);
                console.log(
                    'Failed to disable push notifications, forcibly reconnecting to avoid lag.'
                );
                socket.reset();
                disablePushAuthDisposer = null;
                // Try again to disable notifications.
                socket.onceAuthenticated(disablePushNotifications);
            }
        }
    );
}

function suspendHandler(): void {
    console.log('The system is going to sleep.');
    enablePushNotification();
}

function resumeHandler(): void {
    console.log('The system is going to resume');
    disablePushNotifications();
}

let screenLocked = false;

function lockScreenHandler(): void {
    console.log('The screen is locked.');
    screenLocked = true;
    appState.isIdle = true;
    enablePushNotification();
}

function unlockScreenHandler(): void {
    console.log('The screen is unlocked.');
    screenLocked = false;
    appState.isIdle = false;
    disablePushNotifications();
}

function systemIdleHandler(): void {
    console.log('The system became idle.');
    appState.isIdle = true;
    enablePushNotification();
}

function systemActiveHandler(): void {
    console.log('The system became active (not idle).');
    if (!screenLocked) {
        appState.isIdle = false;
        disablePushNotifications();
    }
}

const idleMonitor = new IdleMonitor(5 * 60); // TODO(dchest): move 5 minutes to config?

export function start(): void {
    electron.powerMonitor.on('suspend', suspendHandler);
    electron.powerMonitor.on('resume', resumeHandler);
    electron.powerMonitor.on('lock-screen', lockScreenHandler);
    electron.powerMonitor.on('unlock-screen', unlockScreenHandler);
    idleMonitor.on('idle', systemIdleHandler);
    idleMonitor.on('active', systemActiveHandler);
    idleMonitor.start();
}

export function stop(): void {
    electron.powerMonitor.removeListener('suspend', suspendHandler);
    electron.powerMonitor.removeListener('resume', resumeHandler);
    electron.powerMonitor.removeListener('lock-screen', lockScreenHandler);
    electron.powerMonitor.removeListener('unlock-screen', unlockScreenHandler);
    idleMonitor.stop();
    idleMonitor.removeListener('idle', systemIdleHandler);
    idleMonitor.removeListener('active', systemActiveHandler);
}
