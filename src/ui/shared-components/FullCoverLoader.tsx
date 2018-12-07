import React from 'react';
import { ProgressBar } from 'peer-ui';

export default function FullCoverLoader(props: { style?: React.CSSProperties; show?: boolean }) {
    return props.show ? (
        <div className="progress-overlay" style={props.style}>
            <ProgressBar />
        </div>
    ) : null;
}
