const React = require('react');
const css = require('classnames');

const MaterialIcon = require('./MaterialIcon');
const CustomIcon = require('./CustomIcon');
const Tooltip = require('./Tooltip');

/*
    PROPS           type        description
    ----------------------------------------
    className       string
    style           object      if !!style, will override css styles

    href            string      if !!href, entire render is different + onClick ignored
    label                       if !!label, child content ignored. can be string or any HTML
    icon            string      MaterialIcon name. if !!icon, child content ignored
    customIcon      string      CustomIcon name

    disabled        bool
    selected        bool        makes button blue (e.g. radio buttons, checkboxes)

    onClick         function
    onMouseEnter    function
    onMouseLeave    function

    tooltip         string
    tooltipPosition string
    tooltipSize     string

    theme           string      theme keywords to apply various styles other than default
                                (no keyword, default theme: $blue text, transparent background)
                                * primary: font color $text-dark-primary
                                * secondary: font color $text-dark-secondary (for secondary action e.g. dialog "cancel")
                                * inverted: font color $text-light-primary
                                * affirmative: green "go" style

                                * small: collapses padding
                                * rounded: more rounded borders
                                * link: style button as link (look like <a>)

                                * no-hover: remove hover effects
    ----------------------------------------
*/

class Button extends React.Component {
    render() {
        const classNames = (
            css(
                'p-button',
                this.props.className,
                this.props.theme,
                {
                    icon: !this.props.label && (this.props.icon || this.props.customIcon),
                    'icon-and-label': this.props.label && (this.props.icon || this.props.customIcon),
                    selected: this.props.selected
                }
            )
        );

        const buttonContent = (
            <span>
                {this.props.icon && <MaterialIcon icon={this.props.icon} />}
                {this.props.customIcon && <CustomIcon icon={this.props.customIcon} />}

                <span>{this.props.label || this.props.children}</span>

                {this.props.tooltip
                    ? <Tooltip
                        text={this.props.tooltip}
                        position={this.props.tooltipPosition || 'top'}
                        size={this.props.tooltipSize}
                    />
                    : null
                }
            </span>
        );

        if (this.props.href) {
            return (
                <a
                    href={this.props.href}
                    className={classNames}
                    onMouseEnter={this.props.onMouseEnter}
                    onMouseLeave={this.props.onMouseLeave}
                    style={this.props.style}
                >
                    {buttonContent}
                </a>
            );
        }

        return (
            <button
                className={classNames}
                onClick={this.props.onClick}
                onMouseEnter={this.props.onMouseEnter}
                onMouseLeave={this.props.onMouseLeave}
                disabled={this.props.disabled}
                style={this.props.style}
            >
                {buttonContent}
            </button>
        );
    }
}

module.exports = Button;
