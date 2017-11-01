const React = require('react');
const { observer } = require('mobx-react');
const { computed } = require('mobx');
const { FontIcon } = require('~/react-toolbox');

@observer
class Breadcrumb extends React.Component {
    handleClick = (path) => {
        console.log(path); // go to path
    }

    @computed get folderPath() {
        const folderPath = [];
        let iterator = this.props.currentFolder;
        do {
            folderPath.unshift(iterator);
            iterator = iterator.parent;
        } while (iterator);
        return folderPath;
    }

    render() {
        const { folderPath } = this;
        return (
            <div className="breadcrumb">
                {this.folderPath.map((folder, i) => (
                    <div key={folder.name || 'root'} className="breadcrumb-entry">
                        <a className="clickable"
                            onClick={() => this.props.onSelectFolder(folder)}>
                            {folder.name || 'Files'}
                        </a>
                        {i !== folderPath.length - 1 && <FontIcon value="keyboard_arrow_right" />}
                    </div>
                ))}
            </div>
        );
    }
}

module.exports = Breadcrumb;
