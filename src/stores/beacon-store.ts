import { action, computed, observable } from 'mobx';
import { User } from 'peerio-icebear';
import {
    addInputListener,
    removeInputListener
} from '~/helpers/input-listener';

class BeaconStore {
    // Beacons in queue to be shown to user.
    // 0th item is currently visible.
    @observable currentBeacons: string[] = [];

    @computed
    get activeBeacon() {
        if (!this.currentBeacons.length) return null;
        return this.currentBeacons[0];
    }

    @action.bound
    increment() {
        if (!this.currentBeacons.length) return;

        // Mark activeBeacon as seen in User beacons
        this.markAsRead(this.activeBeacon);

        // Remove activeBeacon from currentBeacons array
        this.currentBeacons.shift();
    }

    async markAsRead(b: string | string[]): Promise<void> {
        if (typeof b === 'string') {
            User.current.beacons.set(b, true);
        } else {
            b.forEach(beacon => {
                User.current.beacons.set(beacon, true);
            });
        }
        await User.current.saveBeacons();
    }

    // Argument can be string (single beacon) or array (multiple)
    addBeacons = (b: string | string[]): void => {
        if (typeof b === 'string') {
            this.pushBeacon(b);
        } else {
            b.forEach(beacon => {
                this.pushBeacon(beacon);
            });
        }
    };

    // Pushing to currentBeacons but check beacon read status in User profile first
    @action.bound
    async pushBeacon(b: string): Promise<void> {
        const beaconStatus = await User.current.beacons.get(b);
        if (!beaconStatus) {
            this.currentBeacons.push(b);
        }
    }

    // Clear currentBeacons, e.g. if switching to a different beacon flow
    @action.bound
    clearBeacons(): void {
        this.currentBeacons = [];
    }

    // Adding beacons with a delay, based on user inactivity
    @observable beaconsInQueue: string[] = [];
    @observable delay: number;

    @action.bound
    queueBeacons(b: string | string[], delay: number) {
        if (typeof b === 'string') {
            this.beaconsInQueue = [b];
        } else {
            this.beaconsInQueue = b;
        }
        this.delay = delay;

        this.setBeaconTimer();
        addInputListener(this.setBeaconTimer);
    }

    clearQueuedBeacons = () => {
        this.clearBeaconTimer();
        removeInputListener(this.setBeaconTimer);
    };

    @observable beaconTimer: NodeJS.Timer;
    @action.bound
    setBeaconTimer() {
        if (this.beaconTimer) clearTimeout(this.beaconTimer);
        this.beaconTimer = setTimeout(() => {
            this.addBeacons(this.beaconsInQueue);
            this.clearQueuedBeacons();
        }, this.delay);
    }

    @action.bound
    clearBeaconTimer() {
        clearTimeout(this.beaconTimer);
        this.beaconTimer = null;
        this.beaconsInQueue = [];
        this.delay = 0;
    }
}

const store = new BeaconStore();
export default store;
