// @ts-check
const React = require('react');
const { computed, observable } = require('mobx');
const { observer } = require('mobx-react');

@observer
class Beacon extends React.Component {
    @observable containerRef = React.createRef();

    @computed
    get containerDimensions() {
        if (!this.containerRef || !this.containerRef.current) return null;
        return this.containerRef.current.getBoundingClientRect();
    }

    @computed
    get containerWidth() {
        if (!this.containerDimensions) return null;
        return this.containerDimensions.width;
    }

    @computed
    get containerHeight() {
        if (!this.containerDimensions) return null;
        return this.containerDimensions.height;
    }

    // @computed get circleSize() {
    //     const height = this.containerHeight;
    //     const width = this.containerWidth;
    // }

    render() {
        return (
            /*
                The unsightly <div> nesting is so that the container can have any positioning, while the content itself
                is `relative` positioned. This allows the beacon itself to be `absolute` positioned and thus have its
                position defined by the bounds of the child content. Whew!

                All of this means that the beacon ends up positioned without needing to use in-window calculations,
                which is worth the extra verbosity.
            */
            <div className="beacon-container" ref={this.containerRef}>
                <div className="inner-container">
                    {this.props.children}

                    <div className="beacon">
                        <div className="content-container">
                            <div className="rectangle">
                                <div className="header">
                                    Header text goes in here
                                </div>
                                TEXT
                            </div>

                            <div className="circle">CHILDREN`</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

module.exports = Beacon;
