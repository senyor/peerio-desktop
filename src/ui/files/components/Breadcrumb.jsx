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
        window.addEventListener('resize', this.computeFolderWidths, false);
    }

    componentWillUnmount() {
        window.addEventListener('resize', this.computeFolderWidths);
    }

    // @action getButtonWidths = () => {
    //     const buttons = document.querySelectorAll('.breadcrumb .rt-button-button');
    //     Array.prototype.forEach.call(buttons, (button) => {
    //         this.buttonWidths += window.getComputedStyle(button).getPropertyValue('width');
    //         console.log(button);
    //     });
    //     console.log(this.buttonWidths);
    // }

    // Total combined current widths of text, before replacing folder names with ellipses
    @observable folderWidths = [];
    @observable totalWidth = 0;
    @computed get calcTotalWidth() {
        let localTotal = 0;
        this.folderWidths.forEach((folder) => {
            localTotal += folder;
        });
        this.totalWidth = localTotal;
        return this.totalWidth;
    }

    // Actual current widths, after replacing folder names with ellipses
    @observable folderWidthsWithEllipsized = [];
    @observable actualWidth = 0;
    @computed get calcActualWidth() {
        let localTotal = 0;
        this.folderWidthsWithEllipsized.forEach((folder) => {
            localTotal += folder;
        });
        this.actualWidth = localTotal;
        return this.actualWidth;
    }

    @observable foldersToEllipsize = [];

    computeFolderWidths = () => {
        const breadcrumbContainer = document.getElementsByClassName('breadcrumb')[0];

        const containerWidth = parseInt(window.getComputedStyle(breadcrumbContainer).getPropertyValue('width'), 10);
        const folderMaxWidth = 120;
        const iconWidth = 32;

        this.element = document.createElement('canvas');
        this.context = this.element.getContext('2d');
        this.context.font = '600 20px Open Sans'; // hardcoded

        const ellipsisWidth = this.context.measureText('...').width;

        this.folderWidths = [];
        this.folderPath.forEach((folder, i) => {
            let thisWidth;

            if (i === 0) {
                thisWidth = this.context.measureText(t('title_files')).width;
            } else {
                thisWidth = this.context.measureText(folder.name).width + iconWidth;
            }

            this.folderWidths[i] =
                thisWidth <= folderMaxWidth
                    ? thisWidth
                    : folderMaxWidth;
        });

        this.folderWidthsWithEllipsized = this.folderWidths;

        let count = 0;
        while (this.calcActualWidth > containerWidth && count < this.folderWidthsWithEllipsized.length) {
            this.folderWidthsWithEllipsized[count] = ellipsisWidth;
            this.foldersToEllipsize[count] = count;

            count++;
            console.log(`${this.calcActualWidth - containerWidth}  `);
        }

        // while (this.calcActualWidth < containerWidth) {
        // let sum = 0;
        // for (let i = 0; i < this.foldersToEllipsize.length - 1; i++) {
        //     sum += this.foldersToEllipsize[i];
        // }
        // }
    }

    render() {
        const { folderPath } = this;
        return (
            <div className="breadcrumb">
                {this.folderPath.map((folder, i) => (
                    <div key={folder.name || 'root'} className="breadcrumb-entry">
                        <a className="folder-link clickable"
                            onClick={() => this.props.onSelectFolder(folder)}>
                            {this.foldersToEllipsize.indexOf(i) === -1
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
