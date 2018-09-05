import { computed, observable } from 'mobx';

class BeaconStore {
    // Beacon activation
    // Each beacon sequence or "flow" is an array stored in `beaconFlows` object
    @observable
    beaconFlows = {
        messageInput: ['plus-icon', 'app-nav']
    };
    @observable currentBeaconFlow = 'messageInput';
    @observable beaconNumber = 0;

    // Current beacon returns the appropriate entry from `beaconFlows`
    @computed
    get currentBeacon() {
        if (this.beaconNumber < 0 || !this.currentBeaconFlow) return null;
        return this.beaconFlows[this.currentBeaconFlow][this.beaconNumber];
    }

    async init() {
        console.log('init');
    }
}

const store = new BeaconStore();
export default store;
