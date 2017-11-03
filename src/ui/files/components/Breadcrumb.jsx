const React = require('react');
const { observer } = require('mobx-react');
const { computed } = require('mobx');
const { FontIcon } = require('~/react-toolbox');

@observer
class Breadcrumb extends React.Component {
    @computed get folderPath() {
        const folderPath = [];
        let iterator = this.props.currentFolder;
        do {
            folderPath.unshift(iterator);
            iterator = iterator.parent;
        } while (iterator);
        return folderPath;
    }

    componentDidMount() {
        window.addEventListener('resize', this.getAllTextWidths, false);
    }

    componentWillUnmount() {
        window.addEventListener('resize', this.getAllTextWidths);
    }

    // getTextWidth = (text) => {
    //     this.element = document.createElement('canvas');
    //     this.context = this.element.getContext('2d');
    //     this.context.font = '20px Open Sans bold';
    //     return this.context.measureText(text).width;
    // }

    getAllTextWidths = () => {
        const folderLinks = document.getElementsByClassName('folder-link');
        Array.prototype.forEach.call(folderLinks, (folder) => {
            console.log(window.getComputedStyle(folder).getPropertyValue('width'));
        });
    }

    render() {
        const { folderPath } = this;
        return (
            <div className="breadcrumb">
                {this.folderPath.map((folder, i) => (
                    <div key={folder.name || 'root'} className="breadcrumb-entry">
                        <a className="folder-link clickable"
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
