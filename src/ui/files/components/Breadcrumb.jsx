const React = require('react');
const { FontIcon } = require('~/react-toolbox');

// const { t } = require('peerio-translator');
// const T = require('~/ui/shared-components/T');

class Breadcrumb extends React.Component {
    handleClick = (path) => {
        console.log(path); // go to path
    }

    render() {
        /* Breadcrumb component should be given "folderpath" prop
            folderpath = array of arrays of folder/path pairs
                e.g. [['file1', 'path1'], ['file2', 'path2'], ['file3', 'path3']]
        */
        const paths = [];
        for (let i = 0; i < this.props.folderpath.length; i++) {
            paths.push(
                <div key={this.props.folderpath[i][0]} className="breadcrumb-entry">
                    <a className="clickable"
                        onClick={() => this.handleClick(this.props.folderpath[i][1])}>
                        {this.props.folderpath[i][0]}
                    </a>
                    {i !== this.props.folderpath.length - 1 && <FontIcon value="keyboard_arrow_right" /> }
                </div>
            );
        }

        return (
            <div className="breadcrumb">
                {paths}
            </div>
        );
    }
}

module.exports = Breadcrumb;
