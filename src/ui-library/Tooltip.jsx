const React = require('react');
const { action, observable } = require('mobx');
const { observer } = require('mobx-react');

const css = require('classnames');
const { getPositionInWindow } = require('./helpers');

/*
    PROPS       type        description
    ----------------------------------------
    className   string
    text        string
    position    string      top (default), right, bottom, left
    size        string      small, or leave blank for default
    ----------------------------------------

    NOTE:
    To use this component, place <Tooltip> in the render of any component.
    To prevent cutoffs in elements with `overflow:hidden`, tooltip is rendered `position:fixed`.
    So, tooltip's position is calculated based on parentElement's.
    This means that tooltip's position will be relative to position and width/height of its ~immediate parent~.

    This is important for 2 reasons:
    1. Make sure parentElement's width/height matches the actual size of the entire parent component.
    2. Known Chromium bug: parent with `transform:translate` will mess up positioning of fixed-position children.

    See <Avatar> for example use.
*/

@observer
class Tooltip extends React.Component {
    ref;

    @observable isVisible = false;
    @observable style = {
        left: '',
        top: ''
    };

    @action.bound setRef(ref) {
        if (ref) {
            this.ref = ref;
            ref.parentElement.addEventListener('mouseenter', this.showTooltip, false);
            ref.parentElement.addEventListener('mouseleave', this.hideTooltip, false);
            ref.parentElement.addEventListener('click', this.hideTooltip, false);
        }
    }

    componentWillUnmount() {
        if (!this.ref) return;

        this.ref.parentElement.removeEventListener('mouseenter', this.showTooltip);
        this.ref.parentElement.removeEventListener('mouseleave', this.hideTooltip);
        this.ref.parentElement.removeEventListener('click', this.hideTooltip);
    }

    @action.bound showTooltip() {
        if (!this.ref) return;

        const tooltipParent = this.ref.parentElement;
        const { width, height } = this.ref.getBoundingClientRect();
        const { offsetX, offsetY, posX, posY } = getPositionInWindow(tooltipParent);
        const margin = 5;

        switch (this.props.position) {
            default:
            case 'top':
                this.style.left = `${posX - width / 2}px`;
                this.style.top = `${posY - offsetY - height - margin}px`;
                break;
            case 'bottom':
                this.style.left = `${posX - width / 2}px`;
                this.style.top = `${posY + offsetY + margin}px`;
                break;
            case 'left':
                this.style.left = `${posX - offsetX - width - margin}px`;
                this.style.top = `${posY - height / 2}px`;
                break;
            case 'right':
                this.style.left = `${posX + offsetX + margin}px`;
                this.style.top = `${posY - height / 2}px`;
                break;
        }
        this.isVisible = true;
    }

    @action.bound hideTooltip() {
        this.isVisible = false;
    }

    render() {
        return (
            <div
                ref={this.setRef}
                className={css(
                    'p-tooltip',
                    this.props.className,
                    this.props.size
                )}
                style={this.isVisible
                    ? this.style
                    : {
                        /*
                            Need to move hidden tooltip to top-left in order to calculate width/height correctly.
                            (Tooltip near right/bottom of screen may get cut off, which affects calculated bounding box)
                        */
                        left: 0,
                        top: 0,
                        visibility: 'hidden'
                    }
                }
            >
                {this.props.text}
            </div>
        );
    }
}

module.exports = Tooltip;
