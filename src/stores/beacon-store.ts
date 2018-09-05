import { computed, observable } from 'mobx';
import { User } from 'peerio-icebear';

interface BeaconText {
    name: string;
    header?: string;
    body: string;
}

class BeaconStore {
    @observable beacons;

    // Test beacons
    // Will change based on how state mgmt works in SDK
    @observable
    beaconFlows: { [key: string]: BeaconText[] } = {
        messageInput: [
            {
                name: 'plus-icon',
                header: 'sup',
                body:
                    'tesjklsgjdk gjlsdg ksdjglskdjg lskdgj sdlkgj sdlgksjd glksdjg lsdkgj'
            },
            {
                name: 'app-nav',
                body:
                    'tesjklsgjdk gjlsdg ksdjglskdjg lskdgj sdlkgj sdlgksjd glksdjg lsdkgj'
            }
        ]
    };
    @observable currentBeaconFlow = 'messageInput';
    @observable beaconNumber = 0;

    @computed
    get currentBeacon() {
        if (this.beaconNumber < 0 || !this.currentBeaconFlow) return null;
        return this.beaconFlows[this.currentBeaconFlow][this.beaconNumber];
    }

    async init() {
        this.beacons = User.current.beacons;
    }
}

const store = new BeaconStore();
export default store;
