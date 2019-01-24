import React from 'react';
import { action } from 'mobx';
import { observer } from 'mobx-react';
import T from '~/ui/shared-components/T';
import ClosingOverlay from '~/ui/shared-components/closing/ClosingOverlay';
import beaconStore from '~/stores/beacon-store';
import uiStore from '~/stores/ui-store';

@observer
export default class Welcome extends React.Component {
    componentWillMount() {
        beaconStore.queueFirstBeacon('contact', 2000);
    }

    componentWillUnmount() {
        beaconStore.clearQueuedBeacons();
    }

    @action
    dismissClosingOverlay() {
        uiStore.closingBannersVisible.appOverlay = false;
    }

    render() {
        return (
            <>
                {uiStore.closingBannersVisible.appOverlay ? (
                    <ClosingOverlay onDismiss={this.dismissClosingOverlay} />
                ) : null}

                <div className="welcome">
                    <div className="text-container">
                        <T k="title_zeroFirstLoginTitleDesktop" className="heading" />
                        <T k="title_zeroFirstLoginMessage" className="subtitle" />
                        <T k="title_learnFollowWalkthrough" className="small-print" />
                    </div>
                    <div className="image-container">
                        <div className="illustration" />
                    </div>
                </div>
            </>
        );
    }
}
