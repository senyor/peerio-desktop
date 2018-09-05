import React from 'react';
import ReactDOM from 'react-dom';
import {
    action,
    computed,
    observable,
    reaction,
    IReactionDisposer
} from 'mobx';
import { observer } from 'mobx-react';
import css from 'classnames';
import beaconStore from '~/stores/beacon-store';

const appRoot: HTMLElement = document.getElementById('root');

interface BeaconProps {
    activeId: string;
    position?: 'left' | 'right';
    header?: string;
    text: string;
    circleContent: any;
    type?: 'spot' | 'area';
}

interface RectanglePosition {
    top?: string;
    bottom?: string;
    marginTop?: number;
    marginRight?: number;
    marginBottom?: number;
    marginLeft?: number;
    paddingRight?: number;
    paddingLeft?: number;
}

@observer
export default class Beacon extends React.Component<BeaconProps> {
    @computed
    get active() {
        return beaconStore.currentBeacon === this.props.activeId;
    }
    // We make a lot of calculations based on child content size and position
    // `contentRef` stores the ref for the .beacon-container component which contains the child content
    @observable contentRef;
    @observable rendered = false;
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

    @observable dispose: IReactionDisposer;
    @observable renderTimeout: NodeJS.Timer;
    componentWillMount() {
        // Update `contentRect` on window resize
        window.addEventListener('resize', this.setContentRect);

        this.dispose = reaction(
            () => this.active && !!this.contentRef,
            active => {
                if (active) {
                    this.renderTimeout = setTimeout(() => {
                        this.rendered = true;
                    }, 1);
                } else {
                    this.rendered = false;
                }
            }
        );
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.setContentRect);
        this.dispose();
        this.renderTimeout = null;
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
    @observable
    rectangleRef: React.RefObject<HTMLDivElement> = React.createRef();

    // The bubble's vertical position is determined by the beacon's position in the window.
    // The window is divided into 5 horizontal "slices", each corresponding to a bubble position.
    @computed
    get slicePosition() {
        const sliceHeight = window.innerHeight / 5;
        return Math.floor(this.contentRect.top / sliceHeight) + 1;
    }

    // Position and 'slice' classes get repeated for the beacon itself, and the .rectangle and .circle divs
    // This is redundant, but helps keep the styles more organized
    @computed
    get positionClasses() {
        return `${this.props.position || 'left'} slice-${this.slicePosition}`;
    }

    @computed
    get rectangleStyle(): RectanglePosition {
        const ret = {} as RectanglePosition;
        const circleOffset = this.circleSize / 2;

        const rectangleOffset =
            this.rectangleRef && this.rectangleRef.current
                ? this.rectangleRef.current.getBoundingClientRect().height / 2
                : null;

        switch (this.slicePosition) {
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
            ret.paddingRight = circleOffset;
            ret.marginRight = -circleOffset;
        } else {
            // Left is the default
            ret.paddingLeft = circleOffset;
            ret.marginLeft = -circleOffset;
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

    @action.bound
    beaconClick() {
        this.rendered = false;

        this.renderTimeout = setTimeout(() => {
            // If incrementing beaconNumber will go past length of current beaconFlow array, current beacon flow is done
            if (
                beaconStore.beaconNumber + 2 >
                beaconStore.beaconFlows[beaconStore.currentBeaconFlow].length
            ) {
                // // Reset beacon flow
                // beaconStore.beaconNumber = -1;
                // beaconStore.currentBeaconFlow = '';
                beaconStore.beaconNumber = 0;
            } else {
                beaconStore.beaconNumber += 1;
            }
        }, 250);
    }

    // Render the child content, wrapped in .beacon-container div so we can make the above positioning calculations
    childContent = (
        <div
            key="beacon-container"
            className="beacon-container"
            ref={this.setContentRef}
        >
            {this.props.children}
        </div>
    );

    beaconContent() {
        return (
            <div
                key="beacon-content"
                className={css(
                    'beacon',
                    this.props.type || 'spot',
                    this.positionClasses,
                    {
                        show: this.rendered
                    }
                )}
                onClick={this.beaconClick}
                style={this.beaconStyle}
            >
                <div
                    ref={this.rectangleRef}
                    className={css('rectangle', this.positionClasses, {
                        narrow: this.isNarrow
                    })}
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
                    className={css('circle', this.positionClasses, {
                        narrow: this.isNarrow
                    })}
                    style={{
                        height: this.circleSize,
                        width: this.circleSize
                    }}
                >
                    <div className="circle-content">
                        {this.props.circleContent}
                    </div>
                </div>
            </div>
        );
    }

    render() {
        if (!this.active && !this.rendered) return this.childContent;

        const beaconContent = this.beaconContent();

        return [
            this.childContent,
            ReactDOM.createPortal(beaconContent, appRoot)
        ];
    }
}
