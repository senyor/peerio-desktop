const React = require('react');
const { FontIcon } = require('react-toolbox');

function FileLoading(props) {
    return (
        <div className="file-loading" onClick={props.onCancel}>
            <FontIcon value={props.loading} />
            <FontIcon value="close" />
        </div>
    );
}

module.exports = FileLoading;
