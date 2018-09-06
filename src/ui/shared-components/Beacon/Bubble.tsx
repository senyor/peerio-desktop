import React from 'react';
import { observer } from 'mobx-react';
import css from 'classnames';

interface BubbleProps {
    classNames?: string;
    position: string;
    size: number;
    content: any;
}

@observer
export default class Bubble extends React.Component<BubbleProps> {
    render() {
        return (
            <div
                className={css(
                    'circle',
                    this.props.classNames,
                    this.props.position
                )}
                style={{
                    height: this.props.size,
                    width: this.props.size
                }}
            >
                <div className="circle-content">{this.props.content}</div>
            </div>
        );
    }
}
