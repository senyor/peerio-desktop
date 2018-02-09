const React = require('react');
const css = require('classnames');

/*
    PROPS       type        description
    ----------------------------------------
    className   string
    label       string

    checked     bool
    onChange    function
    ----------------------------------------
*/

class Switch extends React.Component {
    render() {
        return (
            <div className={css(
                'p-switch',
                this.props.className
            )}>
                <span className="label">{this.props.label}</span>
                <span className={css(
                    'p-switch-container',
                    { checked: this.props.checked }
                )}>
                    {/* The true <input> is invisible and overlaid on the custom "slider" */}
                    <input
                        type="checkbox"
                        checked={this.props.checked}
                        onChange={this.props.onChange}
                        className="clickable"
                    />
                    <div className="knob" />
                </span>
            </div>
        );
    }
}

module.exports = Switch;
