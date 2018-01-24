const React = require('react');

/*
    PROPS       type        description
    ----------------------------------------
    className   string
    caption                 usually string, can be any HTML. if !!caption, children not rendered
    ----------------------------------------
*/

class ListHeading extends React.Component {
    render() {
        return (
            <li className={this.props.className
                ? `p-list-heading ${this.props.className}`
                : 'p-list-heading'
            }>
                {this.props.caption || this.props.children}
            </li>
        );
    }
}

module.exports = ListHeading;
