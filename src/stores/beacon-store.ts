import { action, computed, observable } from 'mobx';
import { User } from 'peerio-icebear';

class BeaconStore {
    // Beacons in queue to be shown to user.
    // 0th item is currently visible.
    @observable currentBeacons: string[] = [];

    @computed
    get activeBeacon() {
        if (!this.currentBeacons.length) return null;
        return this.currentBeacons[0];
    }

    // "Advances" the beacon flow by removing the 0th entry
    @action.bound
    increment() {
        if (!this.currentBeacons.length) return;

        // Mark activeBeacon as seen in User beacons
        this.markAsRead(this.activeBeacon);

        // Remove activeBeacon from currentBeacons array
        this.currentBeacons.shift();
    }

    // Increment but with a delay passed from component
    @observable delayTimer: NodeJS.Timer;

    @action.bound
    incrementWithDelay(delay: number) {
        this.delayTimer = setTimeout(() => {
            this.increment();
        }, delay);
    }

    @action.bound
    clearIncrementDelay() {
        clearTimeout(this.delayTimer);
        this.delayTimer = null;
    }

    // Mark beacons as read in the user's profile so user is not shown beacons they have dismissed before
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

    // Add beacons to the currentBeacons array. Argument can be string (single beacon) or array (multiple).
    addBeacons = (b: string | string[]): void => {
        if (typeof b === 'string') {
            this.pushBeacon(b);
        } else {
            b.forEach(beacon => {
                this.pushBeacon(beacon);
            });
        }
    };

    // Push to currentBeacons but check beacon read status in User profile first.
    // This is not intended to be called directly. Component should use addBeacons.
    @action.bound
    private async pushBeacon(b: string): Promise<void> {
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

    // Adding beacons with a delay
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
    }

    @action.bound
    clearQueuedBeacons() {
        clearTimeout(this.beaconTimer);
        this.beaconTimer = null;
        this.beaconsInQueue = [];
        this.delay = 0;
    }

    @observable beaconTimer: NodeJS.Timer;
    @action.bound
    setBeaconTimer() {
        this.beaconTimer = setTimeout(() => {
            this.addBeacons(this.beaconsInQueue);
            this.clearQueuedBeacons();
        }, this.delay);
    }
}

const store = new BeaconStore();
export default store;
