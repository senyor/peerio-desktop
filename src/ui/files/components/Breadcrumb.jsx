const React = require('react');
const { FontIcon } = require('~/react-toolbox');
// const { t } = require('peerio-translator');
const T = require('~/ui/shared-components/T');

class Breadcrumb extends React.Component {
    handleClick = () => {

    }

    render() {
        return (
            <div className="breadcrumb">
                <a className="clickable" onClick={this.handleClick}>
                    <T k="title_files" />
                    <FontIcon value="arrow_drop_down" />
                </a>
            </div>
        );
    }
}

module.exports = Breadcrumb;
