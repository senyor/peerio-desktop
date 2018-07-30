// @ts-check
const React = require('react');
const { action, computed, observable } = require('mobx');
const { observer } = require('mobx-react');

/**
 * @augments {React.Component<{
        position?: 'left' | 'right'
        text: string
        header: string
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
        return height > width ? height : width;
    }

    // Beacon's overall positioning
    @computed
    get beaconStyle() {
        return {
            top: this.contentRect.top + this.contentRect.height / 2,
            left: this.contentRect.left + this.contentRect.width / 2,
            marginTop: -this.circleSize / 2,
            marginLeft: -this.circleSize / 2,
            height: this.circleSize,
            width: this.circleSize
        };
    }

    // Rectangle's positioning
    @computed
    get rectangleStyle() {
        const obj = {};
        const offset = this.circleSize / 2;

        // For human-friendliness, the beacon `position` property refers to circle's position relative to rectangle.
        // However the actual positioning is opposite; circle is anchored to content, rectangle is moved around.
        // As a result, the left/right calculations are reversed from what you might expect.
        if (this.props.position === 'right') {
            obj.right = '100%';
            obj.paddingRight = offset;
            obj.marginRight = -offset;

        } else {
            // Left is the default
            obj.left = '100%';
            obj.paddingLeft = offset;
            obj.marginLeft = -offset;
        }

        return obj;
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
        console.log(this.contentRect);
        console.log(this.contentRef.getBoundingClientRect());
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
                    className="rectangle"
                    style={this.rectangleStyle}
                >
                    <div className="rectangle-content">
                        <div className="header">{this.props.header}</div>
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
                    <div
                        className="circle-content"
                        style={this.circleContentOffset}
                    >
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }

    render() {
        return [this.childContent, this.beaconContent];
    }
}

module.exports = Beacon;
