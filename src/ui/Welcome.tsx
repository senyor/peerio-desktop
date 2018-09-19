import React from 'react';
import { observer } from 'mobx-react';
import { action, observable } from 'mobx';
import T from '~/ui/shared-components/T';
import beaconStore from '~/stores/beacon-store';
import {
    addInputListener,
    removeInputListener
} from '~/helpers/input-listener';

@observer
export default class Welcome extends React.Component {
    @observable beaconTimer: NodeJS.Timer;

    @action.bound
    setBeaconTimer() {
        if (this.beaconTimer) clearTimeout(this.beaconTimer);
        this.beaconTimer = setTimeout(() => {
            beaconStore.addBeacons('contact');
            this.clearBeaconTimer();
        }, 2000);
    }

    @action.bound
    clearBeaconTimer() {
        clearTimeout(this.beaconTimer);
        this.beaconTimer = null;
    }

    componentWillMount() {
        this.setBeaconTimer();
        addInputListener(this.setBeaconTimer);
    }

    componentWillUnmount() {
        this.clearBeaconTimer();
        removeInputListener(this.setBeaconTimer);
    }

    render() {
        return (
            <div className="welcome">
                <T k="title_zeroFirstLoginTitleDesktop" className="headline" />
                <T k="title_zeroFirstLoginMessage" className="subtitle" />
                <T k="title_learnFollowWalkthrough" className="small-print" />
            </div>
        );
    }
}
