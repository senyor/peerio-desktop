// @ts-check
const React = require('react');
const { computed, observable } = require('mobx');
const { observer } = require('mobx-react');

@observer
class Beacon extends React.Component {
    // We make a lot of calculations based on child content size and position
    @observable contentRef = React.createRef();

    @computed
    get contentRect() {
        if (!this.contentRef || !this.contentRef.current) {
            return {x: 0, y: 0, width: 0, height: 0};
        }
        return this.contentRef.current.getBoundingClientRect();
    }

    @computed
    get circleSize() {
        const { width, height } = this.contentRect;
        // The size of the circle is the greater of the child content's width and height
        return width > height
            ? width
            : height;
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
                            marginTop: -this.contentRect.height / 2,
                            marginLeft: -this.contentRect.width / 2
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
