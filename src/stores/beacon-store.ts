import { action, computed, observable } from 'mobx';
import { User } from 'peerio-icebear';

interface BeaconText {
    name: string;
    header?: string;
    body: string;
}

class BeaconStore {
    @observable currentBeaconFlow = 'messageInput';
    @observable beaconNumber = 0;

    @computed
    get currentBeacon() {
        // if (this.beaconNumber < 0 || !this.currentBeaconFlow) return null;
        return 'contact';
    }

    @action.bound
    increment() {
        if (
            this.beaconNumber + 2 >
            this.beaconFlows[this.currentBeaconFlow].length
        ) {
            // // Reset beacon flow
            // this.beaconNumber = -1;
            // this.currentBeaconFlow = '';
            this.beaconNumber = 0;
        } else {
            this.beaconNumber += 1;
        }
    }
}

const store = new BeaconStore();
export default store;
