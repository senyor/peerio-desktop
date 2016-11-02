const React = require('react');
const { FontIcon, IconButton, Input } = require('react-toolbox');

class Search extends React.Component {
    render() {
        return (
            <div className="search">
                <FontIcon value="search" className="search-icon" />
                <Input placeholder="search" />
                {/* FIXME: Should only be visible when input has focus */}
                <IconButton icon="highlight_off" />
            </div>
        );
    }
}
module.exports = Search;
