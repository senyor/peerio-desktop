import { remote as electron, PowerMonitor } from 'electron';
import { EventEmitter } from 'events';

// TODO(dchest): move this to global .d.ts for Window, which we'll eventually
// fill with Chrome-specific properties since TypeScript 3.1 removes vendor-specific
// typings from DOM.
interface WindowWithRequestIdleCallback extends Window {
    requestIdleCallback(callback: Function, options: { timeout: number });
}

// XXX(dchest): electron 3.0.2 typings are missing this.
interface PowerMonitorWithQuerySystemIdleState extends PowerMonitor {
    querySystemIdleState(
        idleThreshold: number,
        callback: (idleState: 'active' | 'idle' | 'locked' | 'unknown') => void
    );
}

const activeWindowEvents = [
    'focus',
    'input',
    'keydown',
    'scroll',
    'resize',
    'wheel',
    'mousemove',
    'mousedown'
];

const ACTIVE_EVENT_ID = 'active';
const IDLE_EVENT_ID = 'idle';

/**
 * Idle monitor.
 *
 * Emits 'idle' when the system becames idle. The event may be emitted a bit
 * later (~1.5 minutes) after idle timeout.
 *
 * Emits 'active' when the system goes back from idle state to active. We try
 * to detect when the system becomes active as soon as possible by listening to
 * window events, but if this won't work (e.g. the user is not interacting with
 * Peerio) it will take at most 30 seconds to detect it.
 */
export default class IdleMonitor extends EventEmitter {
    isIdle = false;
    private _idleTimeout: number;
    private _started = false;
    private _checkScheduled = false;

    /**
     * @param idleTimeout the amount of time (in seconds) before considered idle
     */
    constructor(idleTimeout = 5 * 60) {
        super();
        this._idleTimeout = idleTimeout;
    }

    start() {
        if (this._started) return;
        this._started = true;
        this._scheduleCheck();
    }

    stop() {
        this._started = false;
    }

    private _addWindowEventsListeners() {
        activeWindowEvents.forEach(eventName => {
            window.addEventListener(eventName, this._handleWindowEvent, {
                passive: true
            });
        });
    }

    private _removeWindowEventsListeners() {
        activeWindowEvents.forEach(eventName => {
            window.removeEventListener(eventName, this._handleWindowEvent);
        });
    }

    private _handleWindowEvent = () => {
        this._becomeActive();
    };

    private _becomeActive() {
        if (!this.isIdle || !this._started) return;
        this.isIdle = false;
        this._removeWindowEventsListeners();
        this.emit(ACTIVE_EVENT_ID);
        this._scheduleCheck();
    }

    private _becomeIdle() {
        if (this.isIdle || !this._started) return;
        this.isIdle = true;
        this.emit(IDLE_EVENT_ID);
        this._addWindowEventsListeners();
        this._scheduleCheck();
    }

    private _scheduleCheck() {
        if (!this._started || this._checkScheduled) return;

        this._checkScheduled = true;

        if (!this.isIdle) {
            // When not idle, to minimize consumption of system resources for
            // polling the system idle state (this check can be synchronous on
            // some systems), every minute we request an idle callback (with
            // timeout set to half a minute), where the actual check is
            // performed, thus systemIdleTimeout is not a strict threshold and
            // can be ~1.5 min late.
            setTimeout(() => {
                if (!this._started) return;
                (window as WindowWithRequestIdleCallback).requestIdleCallback(
                    () => {
                        if (!this._started) return;
                        this._doCheck();
                    },
                    { timeout: 30 * 1000 }
                );
            }, 60 * 1000);
        } else {
            // When idle, we want to minimize time to detect when system
            // becomes active, so request check every half a minute.
            setTimeout(() => {
                if (!this._started) return;
                this._doCheck();
            }, 30 * 1000);
        }
    }

    private _doCheck() {
        (electron.powerMonitor as PowerMonitorWithQuerySystemIdleState).querySystemIdleState(
            this._idleTimeout,
            idleState => {
                this._checkScheduled = false;

                const nowIdle = idleState === 'idle' || idleState === 'locked';

                if (!this.isIdle && nowIdle) {
                    this._becomeIdle();
                } else if (this.isIdle && !nowIdle) {
                    this._becomeActive();
                } else {
                    // State didn't change, schedule check again.
                    this._scheduleCheck();
                }
            }
        );
    }
}
