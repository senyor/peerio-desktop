import React from 'react';
import { ProgressBar } from 'peer-ui';

function FullCoverLoader(props) {
    return props.show ? (
        <div className="progress-overlay" style={props.style}>
            <ProgressBar mode="indeterminate" />
        </div>
    ) : null;
}

export default FullCoverLoader;
