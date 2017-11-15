const React = require('react');
// const { computed } = require('mobx');
const css = require('classnames');

class FileSpriteIcon extends React.Component {
    /* props
        size: medium, large
        type: img, audio, video, txt, zip, pdf, ai, psd, word, xls, ppt, other
    */

    get pxResolution() {
        if (this.props.size === 'large') {
            return 'ic-48dp';
        }
        return 'ic-32dp';
    }

    render() {
        const fileIconType = `ic-file-${this.props.type}-${this.props.size}`;
        return (
            <div className={css('file-sprite-icon', fileIconType, this.pxResolution)} />
        );
    }
}

module.exports = FileSpriteIcon;
