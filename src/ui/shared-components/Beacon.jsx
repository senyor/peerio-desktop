// @ts-check
const React = require('react');
const { computed, observable } = require('mobx');
const { observer } = require('mobx-react');

@observer
class Beacon extends React.Component {
    // We make a lot of calculations based on child content size and position
    @observable contentRef = React.createRef();

    @computed
    get contentDimensions() {
        if (!this.contentRef || !this.contentRef.current) return null;
        return this.contentRef.current.getBoundingClientRect();
    }

    @computed
    get contentHeight() {
        if (!this.contentDimensions) return null;
        return this.contentDimensions.height;
    }

    @computed
    get contentWidth() {
        if (!this.contentDimensions) return null;
        return this.contentDimensions.width;
    }

    @computed
    get circleSize() {
        // The size of the circle is the greater of the child content's width and height
        return this.contentWidth > this.contentHeight
            ? this.contentWidth
            : this.contentHeight;
    }

    @computed
    get circleStyle() {
        return {
            width: this.circleSize,
            height: this.circleSize,
            left: -this.circleSize / 2,
            top: -this.circleSize / 2
        };
    }

    // Beacon functions
    beaconClick = () => {
        console.log('beacon click');
    };

    // HTML content
    childContent = (
        <div className="beacon-container" key="container" ref={this.contentRef}>
            {this.props.children}
        </div>
    );

    @computed
    get beaconContent() {
        return (
            <div className="beacon" key="beacon" onClick={this.beaconClick}>
                <div className="rectangle">
                    <div className="header">Header text goes in here</div>
                    TEXT
                </div>

                <div className="circle" style={this.circleStyle}>
                    <div
                        className="circle-content"
                        style={{
                            marginTop: -this.contentHeight / 2,
                            marginLeft: -this.contentWidth / 2
                        }}
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
