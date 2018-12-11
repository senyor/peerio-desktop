import React from 'react';
import { observer } from 'mobx-react';
import css from 'classnames';

interface FileSpriteIconProps {
    size?: 'small' | 'medium' | 'large' | 'xlarge';
    type: string;
}

@observer
export default class FileSpriteIcon extends React.Component<FileSpriteIconProps> {
    get pxResolution() {
        switch (this.props.size) {
            case 'small':
                return 'ic-24dp';
            default:
            case 'medium':
                return 'ic-32dp';
            case 'large':
                return 'ic-48dp';
            case 'xlarge':
                return 'ic-56dp';
        }
    }

    render() {
        const fileIconType = `ic-file-${this.props.type}-${this.props.size}`;
        return <div className={css('file-sprite-icon', fileIconType, this.pxResolution)} />;
    }
}
