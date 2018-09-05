import { computed, observable } from 'mobx';
import { User } from 'peerio-icebear';

// interface BeaconText {
//     header?: string;
//     body: string;
// }

class BeaconStore {
    @observable beacons;

    // Test beacons
    // Will change based on how state mgmt works in SDK
    @observable
    beaconFlows = {
        messageInput: ['plus-icon', 'app-nav']
    };
    @observable currentBeaconFlow = 'messageInput';
    @observable beaconNumber = 0;

    @computed
    get currentBeacon() {
        if (this.beaconNumber < 0 || !this.currentBeaconFlow) return null;
        return this.beaconFlows[this.currentBeaconFlow][this.beaconNumber];
    }

    async init() {
        console.log(
            '_______________________INIT BEACONS______________________'
        );
        console.log(User.current.beacons);
        this.beacons = User.current.beacons;
    }
}

const store = new BeaconStore();
export default store;
