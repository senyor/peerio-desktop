const React = require('react');
const { FontIcon, IconButton, Input } = require('react-toolbox');
const { t } = require('peerio-translator');

class Search extends React.Component {
    render() {
        return (
            <div className="search">
                <FontIcon value="search" className="search-icon" />
                <Input placeholder={t('messageSearch')} />
                {/* FIXME: Should only be visible when input has focus */}
                <IconButton icon="highlight_off" />
            </div>
        );
    }
}
module.exports = Search;
