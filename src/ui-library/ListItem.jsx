const React = require('react');
const css = require('classnames');

const MaterialIcon = require('./MaterialIcon');
const { getDataProps } = require('~/helpers/dom');

/*
    PROPS       type        description
    ----------------------------------------
    className   string
    disabled    bool

    caption                 usually string, can be any HTML. if !!caption, children not rendered
    legend                  usually string, can be any HTML. requires caption.

    leftContent             any HTML. renders to left of caption||children
    leftIcon    string      MaterialIcon name. if !!leftIcon, leftContent doesn't render

    rightContent            any HTML. renders to right of caption||children
    rightIcon   string      MaterialIcon name. if !!rightIcon, rightContent doesn't render

    onClick     function
    ----------------------------------------
*/

class ListItem extends React.Component {
    render() {
        return (
            <li
                className={css(
                    'p-list-item',
                    this.props.className,
                    { disabled: this.props.disabled }
                )}
                onClick={this.props.onClick}
                {...getDataProps(this.props)}
            >
                {this.props.leftIcon
                    ? <div className="side-content left icon">
                        <MaterialIcon icon={this.props.leftIcon} />
                    </div>
                    : (this.props.leftContent
                        ? <div className="side-content left">
                            {this.props.leftContent}
                        </div>
                        : null
                    )
                }

                {this.props.caption
                    ? <div className="content">
                        <div className="caption">{this.props.caption}</div>
                        {this.props.legend
                            ? <div className="legend">{this.props.legend}</div>
                            : null
                        }
                    </div>
                    : <div className="content">{this.props.children}</div>
                }

                {this.props.rightIcon
                    ? <div className="side-content right icon">
                        <MaterialIcon icon={this.props.rightIcon} />
                    </div>
                    : (this.props.rightContent
                        ? <div className="side-content right">
                            {this.props.rightContent}
                        </div>
                        : null
                    )
                }
            </li>
        );
    }
}

module.exports = ListItem;
