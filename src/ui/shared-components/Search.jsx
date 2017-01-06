const React = require('react');
const { FontIcon, IconButton, Input } = require('~/react-toolbox');
const { t } = require('peerio-translator');
const { observable } = require('mobx');
const { observer } = require('mobx-react');
@observer
class Search extends React.Component {
    @observable query = '';
    handleChange = val => {
        this.query = val;
        this.props.onChange(val);
    };

    handleClear = () => {
        this.handleChange('');
    };

    render() {
        return (
            <div className="search">
                <FontIcon value="search" className="search-icon" />
                <Input placeholder={t('search')} value={this.query} onChange={this.handleChange} />
                {this.query === '' ? null : <IconButton icon="highlight_off" onClick={this.handleClear} />}
            </div>
        );
    }
}
module.exports = Search;
