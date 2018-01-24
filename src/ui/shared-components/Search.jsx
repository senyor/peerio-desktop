const React = require('react');
const { Button, MaterialIcon } = require('~/peer-ui');
const { Input } = require('~/react-toolbox');
const { t } = require('peerio-translator');
const { observer } = require('mobx-react');

@observer
class Search extends React.Component {
    handleChange = val => {
        this.props.onChange(val);
    };

    handleClear = () => {
        this.handleChange('');
    };

    render() {
        return (
            <div className="search">
                <MaterialIcon icon="search" className="search-icon" />
                <Input placeholder={t('title_search')} value={this.props.query} onChange={this.handleChange} />
                {this.props.query === '' ? null : <Button icon="highlight_off" onClick={this.handleClear} />}
            </div>
        );
    }
}
module.exports = Search;
