import React from 'react';
import PlusIcon from '~/ui/shared-components/PlusIcon';
import Beacon from '~/ui/shared-components/Beacon';
import { observer } from 'mobx-react';

@observer
class PlusIconBeaconed extends React.Component {
    render() {
        return (
            <Beacon
                name={this.props.beaconName}
                type="spot"
                size={48}
                offsetX={100}
                className="chatlist-plusicon-beacon"
                onContentClick={this.props.onClick}
            >
                <PlusIcon {...this.props} />
            </Beacon>
        );
    }
}

export default PlusIconBeaconed;
