const React = require('react');
const { FontIcon } = require('~/react-toolbox');

// const { t } = require('peerio-translator');
// const T = require('~/ui/shared-components/T');

class Breadcrumb extends React.Component {
    handleClick = (path) => {
        console.log(path); // go to path
    }

    render() {
        const { folderpath } = this.props;
        return (
            <div className="breadcrumb">
                {folderpath.map((folder, i) => (
                    <div key={folder.name || 'root'} className="breadcrumb-entry">
                        <a className="clickable"
                            onClick={() => this.props.onSelectFolder(folder)}>
                            {folder.name || 'Files'}
                        </a>
                        {i !== this.props.folderpath.length - 1 && <FontIcon value="keyboard_arrow_right" />}
                    </div>
                ))}
            </div>
        );
    }
}

module.exports = Breadcrumb;
