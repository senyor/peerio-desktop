const React = require('react');
const uiStore = require('~/stores/ui-store');
const { when } = require('mobx');
const { observer } = require('mobx-react');

@observer
class ReloadingImage extends React.Component {
    disposeReloadListener = null;

    assignImageRef = (ref) => { this.image = ref; };

    retryDownload = () => { this.image.src = this.props.url; };

    onError = () => {
        if (!this.disposeReloadListener) {
            this.disposeReloadListener = when(() => uiStore.isOnline, this.retryDownload);
        }
    }

    componentWillUnmount() {
        if (this.disposeReloadListener) {
            this.disposeReloadListener();
        }
    }

    render() {
        const { url, onLoad, alt } = this.props;
        return (
            <img
                ref={this.assignImageRef}
                src={url}
                onLoad={onLoad}
                onError={this.onError}
                alt={alt}
            />
        );
    }
}

module.exports = ReloadingImage;
