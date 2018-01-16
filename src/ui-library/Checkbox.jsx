const React = require('react');
const css = require('classnames');

/*
    PROPS       type        description
    ----------------------------------------
    className   string
    checked     boolean
    onChange    function
    label                   usually string, can be any HTML
    ----------------------------------------
*/

class Checkbox extends React.Component {
    render() {
        return (
            <span
                className={css(
                    'p-checkbox',
                    this.props.className
                )}
            >
                <span className="p-checkbox-container">
                    {/* The true <input> is invisible and overlaid on the Material Icon span */}
                    <input
                        type="checkbox"
                        checked={this.props.checked}
                        onChange={this.props.onChange}
                        className="clickable"
                    />
                    <span className={css(
                        'material-icons',
                        { selected: this.props.checked }
                    )}>
                        {this.props.checked
                            ? 'check_box'
                            : 'check_box_outline_blank'
                        }
                    </span>
                </span>

                {this.props.label &&
                    <span className="p-checkbox-label">
                        {this.props.label}
                    </span>
                }
            </span>
        );
    }
}

module.exports = Checkbox;
