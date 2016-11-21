const React = require('react');
const { FontIcon } = require('react-toolbox');

function FileLoading(props) {
    return (
        //TODO add onClick cancel loading function
        <div className="file-loading">
            {/* TODO make loading return file_upload or file_download */}
            <FontIcon value={props.loading} />
        </div>
    );
}

module.exports = FileLoading;
