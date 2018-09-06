import React from 'react';
import { observer } from 'mobx-react';
import css from 'classnames';

interface ArrowProps {
    classNames?: string;
    position: string;
}

@observer
export default class Arrow extends React.Component<ArrowProps> {
    render() {
        return (
            <div
                className={css(
                    'arrow',
                    this.props.classNames,
                    this.props.position
                )}
            />
        );
    }
}
