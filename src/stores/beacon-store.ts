import { computed, observable } from 'mobx';

class BeaconStore {
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
        // Plug in to SDK here
        console.log('init');
    }
}

const store = new BeaconStore();
export default store;
