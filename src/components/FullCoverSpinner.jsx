const React = require('react');
const { ProgressBar } = require('react-toolbox');

function FullCoverSpinner(props) {
    return props.show ? (
        <div className="progress-overlay" >
            {/* <ProgressBar className="self-center" type="circular" mode="indeterminate" multicolor /> */}
            <ProgressBar mode="indeterminate" />
        </div>
    ) : null;
}

module.exports = FullCoverSpinner;
