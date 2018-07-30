// @ts-check
const React = require('react');
const { action, computed, observable } = require('mobx');
const { observer } = require('mobx-react');
const css = require('classnames');

/**
 * @augments {React.Component<{
        active?: boolean
        position?: 'left' | 'right'
        header?: string
        text: string
        circleContent: any
    }, {}>}
 */
@observer
class Beacon extends React.Component {
    // We make a lot of calculations based on child content size and position
    // `contentRef` stores the ref for the .beacon-container component which contains the child content
    @observable contentRef;
    setContentRef = ref => {
        if (ref) {
            this.contentRef = ref;
            this.setContentRect();
        }
    };

    // `contentRect` stores the bounding rect for the child content.
    // We give it default values to start, to prevent null references
    @observable
    contentRect = {
        top: 0,
        left: 0,
        height: 0,
        width: 0
    };

    @action.bound
    setContentRect() {
        if (this.contentRef) {
            this.contentRect = this.contentRef.getBoundingClientRect();
        }
    }

    // Update `contentRect` on window resize
    componentWillMount() {
        window.addEventListener('resize', this.setContentRect);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.setContentRect);
    }

    // The size of the circle is the greater of the child content's width and height
    // Circle size is needed to calculate the positioning of the beacon
    @computed
    get circleSize() {
        const { height, width } = this.contentRect;
        return height > width ? height + 8 : width + 8;
    }

    // Beacon's overall positioning
    @computed
    get beaconStyle() {
        return {
            // Anchor top-left corner to child content centre
            top: this.contentRect.top + this.contentRect.height / 2,
            left: this.contentRect.left + this.contentRect.width / 2,

            // Then offset back by circleSize, so that circle content centre aligns with child content centre
            marginTop: -this.circleSize / 2,
            marginLeft: -this.circleSize / 2,

            height: this.circleSize,
            width: this.circleSize
        };
    }

    // Rectangle's positioning
    @observable rectangleRef = React.createRef();

    @computed
    get rectangleStyle() {
        const ret = {};
        const circleOffset = this.circleSize / 2;

        // The bubble's vertical position is determined by the beacon's position in the window.
        // The window is divided into 5 horizontal "slices", each corresponding to a bubble position.
        const sliceHeight = window.innerHeight / 5;
        const sliceNumber = Math.floor(this.contentRect.top / sliceHeight) + 1;
        const rectangleOffset =
            this.rectangleRef && this.rectangleRef.current
                ? this.rectangleRef.current.getBoundingClientRect().height / 2
                : null;

        switch (sliceNumber) {
            case 1:
                ret.top = '0';
                ret.marginTop = circleOffset;
                break;
            case 2:
                ret.top = '0';
                break;
            case 3:
            default:
                ret.top = '50%';
                ret.marginTop = -rectangleOffset;
                break;
            case 4:
                ret.bottom = '0';
                break;
            case 5:
                ret.bottom = '0';
                ret.marginBottom = circleOffset;
                break;
        }

        // For human-friendliness, `position` prop refers to circle's horizontal position relative to rectangle.
        // The actual positioning is opposite: circle is anchored to content, rectangle is moved around.
        // As a result, the calculations may be reversed from what you expect.
        if (this.props.position === 'right') {
            ret.right = '100%';
            ret.paddingRight = circleOffset;
            ret.marginRight = -circleOffset;
            ret.paddingLeft = 8; // add $padding-default to the non-bubble side
        } else {
            // Left is the default
            ret.left = '100%';
            ret.paddingLeft = circleOffset;
            ret.marginLeft = -circleOffset;
            ret.paddingRight = 8;
        }

        return ret;
    }

    // `narrow` class added when rectangle height is less than two lines of text
    // (currently a hardcoded pixel value hardcoded)
    @computed
    get isNarrow() {
        if (!this.rectangleRef || !this.rectangleRef.current) return null;
        return this.rectangleRef.current.getBoundingClientRect().height < 72;
    }

    // The inner content of the circle needs to have a calculated position based on circle width
    // This is so that the content is properly centered
    @computed
    get circleContentOffset() {
        if (!this.contentRef) return null;
        const { width, height } = this.contentRef.getBoundingClientRect();

        return {
            marginTop: -height / 2,
            marginLeft: -width / 2
        };
    }

    beaconClick = () => {
        const sliceHeight = window.innerHeight / 5;
        const sliceNumber = Math.floor(this.contentRect.top / sliceHeight) + 1;

        console.log(sliceNumber);

        console.log('beacon click');
    };

    // Render the child content, wrapped in .beacon-container div so we can make the above positioning calculations
    childContent = (
        <div
            className="beacon-container"
            key="container"
            ref={this.setContentRef}
        >
            {this.props.children}
        </div>
    );

    // Beacon content needs to be `computed` because styles (positioning & sizing) can change based on observables
    @computed
    get beaconContent() {
        return (
            <div
                className="beacon"
                key="beacon"
                onClick={this.beaconClick}
                style={this.beaconStyle}
            >
                <div
                    ref={this.rectangleRef}
                    className={css('rectangle', { narrow: this.isNarrow })}
                    style={this.rectangleStyle}
                >
                    <div className="rectangle-content">
                        {this.props.header ? (
                            <div className="header">{this.props.header}</div>
                        ) : null}
                        {this.props.text}
                    </div>
                </div>

                <div
                    className="circle"
                    style={{
                        height: this.circleSize,
                        width: this.circleSize
                    }}
                >
                    {this.props.circleContent}
                </div>
            </div>
        );
    }

    render() {
        if (!this.props.active) return this.props.children;
        return [this.childContent, this.beaconContent];
    }
}

module.exports = Beacon;
