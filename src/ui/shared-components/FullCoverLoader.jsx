const React = require('react');
const { ProgressBar } = require('~/react-toolbox');

function FullCoverLoader(props) {
    return props.show ? (
        <div className="progress-overlay" style={props.style}>
            {/* <ProgressBar className="self-center" type="circular" mode="indeterminate" multicolor /> */}
            <ProgressBar mode="indeterminate" />
        </div>
    ) : null;
}

module.exports = FullCoverLoader;
