const React = require('react');
const css = require('classnames');

/*
    PROPS       type        description
    ----------------------------------------
    className   string
    icon        string      icon name, no ext (see static/img/custom-icons)
    size        string      small, medium (default)
    ----------------------------------------
*/

class CustomIcon extends React.Component {
    render() {
        return (
            <img
                className={css(
                    'p-custom-icon',
                    this.props.size,
                    this.props.className
                )}
                src={`./static/custom-icons/${this.props.icon}.svg`}
            />
        );
    }
}

module.exports = CustomIcon;
