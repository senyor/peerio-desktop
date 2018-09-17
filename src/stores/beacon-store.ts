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
        // Timeout is necessary to keep beacon "active" (rendered) until it has faded out
        setTimeout(() => {
            this.currentBeacons.shift();
        }, 250);
    }

    async markAsRead(b: string | string[]): Promise<void> {
        console.log(`mark as read ${b}`);

        // if (typeof b === 'string') {
        //     User.current.beacons[b] = true;
        // } else {
        //     b.forEach(beacon => {
        //         User.current.beacons[beacon] = true;
        //     });
        // }
        // await User.current.saveBeacons();
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

    // Pushing to currentBeacons but check beacon read status in icebear first
    @action.bound
    pushBeacon(b: string): void {
        if (!User.current.beacons[b]) {
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