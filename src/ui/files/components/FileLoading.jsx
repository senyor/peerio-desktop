const React = require('react');
const { FontIcon } = require('react-toolbox');

function FileLoading(props) {
    return (
        <div className="file-loading">
            {/* TODO make loading return file_upload or file_download */}
            {/* TODO add onClick cancel loading function */}
            <FontIcon value={props.loading} />
        </div>
    );
}

module.exports = FileLoading;
