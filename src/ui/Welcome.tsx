import React from 'react';
import { observer } from 'mobx-react';
import T from '~/ui/shared-components/T';
import beaconStore from '~/stores/beacon-store';

@observer
export default class Welcome extends React.Component {
    beaconTimer: NodeJS.Timer;

    componentWillMount() {
        this.beaconTimer = setTimeout(() => {
            beaconStore.addBeacons('contact');
        }, 5000);
    }

    componentWillUnmount() {
        clearTimeout(this.beaconTimer);
        this.beaconTimer = null;
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
