import React from 'react';
import AppNavButton from './AppNavButton';
import uiStore from '~/stores/ui-store';
import beaconStore from '~/stores/beacon-store';
import Beacon from '~/ui/shared-components/Beacon';
import { observer } from 'mobx-react';

@observer
export default class AppNavBeaconedItem extends React.Component<{
    onClick?: () => void;
    beaconName: string;
}> {
    // When Beacon is directly dismissed (rather than Beacon bubble being clicked), cancel remaining onboarding beacons
    cancelOnboardingBeacons() {
        if (uiStore.firstLogin) {
            beaconStore.markAsRead(['chat', 'files', 'contact']);
        }
    }

    onNavigateClick = () => {
        beaconStore.clearBeacons();
        this.cancelOnboardingBeacons();
        this.props.onClick();
    };

    render() {
        return (
            <Beacon
                type="spot"
                name={this.props.beaconName}
                size={48}
                className="appnav-beacon"
                onContentClick={this.props.onClick}
                onBeaconClick={this.cancelOnboardingBeacons}
            >
                <AppNavButton {...this.props} onClick={this.onNavigateClick} />
            </Beacon>
        );
    }
}
