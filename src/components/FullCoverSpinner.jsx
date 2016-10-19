const React = require('react');
const { ProgressBar } = require('react-toolbox');

function FullCoverSpinner(props) {
    return props.show ? (
      <div className="full-cover-spinner" >
        <ProgressBar className="self-center" type="circular" mode="indeterminate" multicolor />
      </div>
    ) : null;
}

module.exports = FullCoverSpinner;
