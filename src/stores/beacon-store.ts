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
        // Mark activeBeacon as seen in User beacons
        User.current.beacons[this.activeBeacon] = true;

        // Remove activeBeacon from currentBeacons array
        this.currentBeacons.unshift();
    }

    // Argument can be string (single beacon) or array (multiple)
    addBeacons = (b: string[] | string): void => {
        if (typeof b === 'string') {
            this.pushBeacon(b);
        } else {
            b.forEach(beacon => {
                this.pushBeacon(beacon);
            });
        }
    };

    // Function for pushing to currentBeacons which checks beacon read status in icebear first
    @action.bound
    pushBeacon(b: string): void {
        if (!User.current.beacons[b]) {
            this.currentBeacons.push(b);
        }
    }

    @action.bound
    clearBeacons() {
        this.currentBeacons = [];
    }
}

const store = new BeaconStore();
export default store;
