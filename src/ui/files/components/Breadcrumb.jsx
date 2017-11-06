const React = require('react');
const { computed, observable } = require('mobx');
const { observer } = require('mobx-react');
const { FontIcon } = require('~/react-toolbox');
const { t } = require('peerio-translator');

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
        window.addEventListener('resize', this.ellipsizeFolderNames, false);
    }

    componentWillUnmount() {
        window.addEventListener('resize', this.ellipsizeFolderNames);
    }

    handleClick = (folder) => {
        this.props.onSelectFolder(folder);
        this.ellipsizeFolderNames();
    }

    // Total combined current widths of text, before replacing folder names with ellipses
    @computed get folderWidths() {
        const array = [];
        this.folderPath.forEach((folder) => {
            folder.name
                ? array.push(folder.name)
                : array.push(t('title_files'));
        });

        return this.calcTextWidths(array);
    }

    // Folders, by index, that will be ellipsized
    @observable foldersToEllipsize = -1;

    // Actual current widths, after replacing folder names with ellipses
    @computed get folderWidthsWithEllipsized() {
        const array = [];
        this.folderPath.forEach((folder) => {
            folder.name
                ? array.push(folder.name)
                : array.push(t('title_files'));
        });

        for (let i = 0; i <= this.foldersToEllipsize; i++) {
            array[i] = '...';
        }

        return this.calcTextWidths(array);
    }

    // Takes array of folder names, return array of the widths of those names
    calcTextWidths(array) {
        this.element = document.createElement('canvas');
        this.context = this.element.getContext('2d');
        this.context.font = '600 20px Open Sans'; // hardcoded, need to change if font stack changes!

        const widthArray = [];
        const folderMaxWidth = 120;

        array.forEach((folder) => {
            const thisWidth = this.context.measureText(folder).width;
            widthArray.push(
                thisWidth < folderMaxWidth
                    ? thisWidth
                    : folderMaxWidth
            );
        });

        return widthArray;
    }

    // Used to calculate total actual width of folder names, including ellipsized names
    @computed get totalWidth() {
        this.element = document.createElement('canvas');
        this.context = this.element.getContext('2d');
        this.context.font = '600 20px Open Sans'; // hardcoded, need to change if font stack changes!

        let totalWidth = 0;
        const folderMaxWidth = 120;

        this.folderWidthsWithEllipsized.forEach((width) => {
            totalWidth += width < folderMaxWidth
                ? width
                : folderMaxWidth;
        });

        // Add width of icons (hardcoded at 32px right now)
        totalWidth += 32 * (this.folderWidthsWithEllipsized.length - 1);

        return totalWidth;
    }

    ellipsizeFolderNames = () => {
        const breadcrumbContainer = document.getElementsByClassName('breadcrumb')[0];
        const containerWidth = parseInt(window.getComputedStyle(breadcrumbContainer).getPropertyValue('width'), 10);

        let countUp = 0;
        while (this.totalWidth > containerWidth && countUp < this.folderWidthsWithEllipsized.length) {
            this.foldersToEllipsize = countUp;
            countUp++;
        }

        while ((this.folderWidths[this.foldersToEllipsize] - this.folderWidthsWithEllipsized[this.foldersToEllipsize])
            < (containerWidth - this.totalWidth)) {
            this.foldersToEllipsize--;
        }
    }

    render() {
        const { folderPath } = this;
        return (
            <div className="breadcrumb">
                {this.folderPath.map((folder, i) => (
                    <div key={folder.name || 'root'} className="breadcrumb-entry">
                        <a className="folder-link clickable"
                            onClick={() => this.handleClick(folder)}>
                            {i > this.foldersToEllipsize
                                ? folder.name || t('title_files')
                                : '...'
                            }
                        </a>
                        {i !== folderPath.length - 1 && <FontIcon value="keyboard_arrow_right" />}
                    </div>
                ))}
            </div>
        );
    }
}

module.exports = Breadcrumb;
