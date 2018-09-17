import { action, computed, observable } from 'mobx';
import { User } from 'peerio-icebear';

class BeaconStore {
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

    @observable clearTimer: NodeJS.Timer;

    @action.bound
    clearBeacons(): void {
        this.currentBeacons = [];
    }
}

const store = new BeaconStore();
export default store;
