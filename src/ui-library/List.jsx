const React = require('react');
const css = require('classnames');

/*
    PROPS       type        description
    ----------------------------------------
    className   string
    clickable   bool
    theme       string      large, no-hover
    ----------------------------------------
*/

class List extends React.Component {
    render() {
        return (
            <ul className={css(
                'p-list',
                this.props.className,
                this.props.theme,
                { clickable: this.props.clickable }
            )}>
                {this.props.children}
            </ul>
        );
    }
}

module.exports = List;
