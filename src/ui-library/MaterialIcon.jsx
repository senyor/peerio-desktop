const React = require('react');

/*
    PROPS       type        description
    ----------------------------------------
    className   string
    icon        string      Material Icon name with underscores for spaces
    ----------------------------------------

    TODO: size (rarely deviates from 24px, currently handled at CSS level)
*/

class MaterialIcon extends React.Component {
    render() {
        const classNames = this.props.className
            ? `material-icons ${this.props.className}`
            : 'material-icons';

        return (
            <span className={classNames}>
                {this.props.icon}
            </span>
        );
    }
}

module.exports = MaterialIcon;
