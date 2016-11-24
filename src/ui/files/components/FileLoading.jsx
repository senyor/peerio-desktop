const React = require('react');
const { FontIcon } = require('react-toolbox');

function FileLoading(props) {
    return (
        <div className="file-loading">
            <FontIcon value={props.loading} />
        </div>
    );
}

module.exports = FileLoading;
