const React = require('react');
const { Button } = require('~/react-toolbox');
const { observer } = require('mobx-react');
const { observable, computed, reaction, action } = require('mobx');
const { t } = require('peerio-translator');
const css = require('classnames');
const warningController = require('~/helpers/warning-controller');
const config = require('~/config');

@observer class Snackbar extends React.Component {

    @observable isForeground = false; // whether this particular snackbar instance is foregrounded
    @observable isLocallyVisible = true; // used to delay hiding for animation
    @observable snackbarClass = '';
    @observable wrapperClass = 'banish';

    @computed get isVisible() {
        return !!warningController.current
            && this.isLocallyVisible
            && warningController.hasVisibleSnackbar
            && this.isForeground;
    }

    constructor() {
        super();

        this.fadeIn = this.fadeIn.bind(this);
        this.close = this.close.bind(this);
        this.fadeOutAndDismiss = this.fadeOutAndDismiss.bind(this);

        // handle animation
        reaction(() => this.isVisible, (visible) => {
            if (visible) {
                this.fadeIn();
            } else {
                this.fadeOutAndDismiss();
            }
        });
    }

    /**
     * Register this snackbar instance.
     */
    componentWillMount() {
        warningController.registerComponent(this);
        if (this.props.priority > 0) {
            warningController.promoteComponent(this.props.location);
        }
    }

    /**
     * Unegister this snackbar instance.
     */
    componentWillUnmount() {
        warningController.unregisterComponent(this);
    }

    /**
     *  Animate fadeIn.
     **/
    @action fadeIn() {
        setTimeout(() => {
            this.wrapperClass = '';
            setTimeout(() => {
                this.snackbarClass = 'show';
                if (this.autoDismiss) {
                    setTimeout(() => {
                        this.close();
                    }, 5000);
                }
            }, 5);
        }, 200); // must happen *after* fadeOut
    }

    /**
     *  Animate fadeOut and dismiss warning.
     **/
    @action fadeOutAndDismiss() {
        this.snackbarClass = '';
        setTimeout(() => {
            this.wrapperClass = 'banish';
            warningController.next();
        }, 150);
    }

    /**
     *  Hide the snackbar. Will trigger fadeout.
     **/
    @action close() {
        this.isLocallyVisible = false;
    }

    renderAnchor(url, text) {
        return (<a href={url}>{text}</a>);
    }

    // USAGE EXAMPLE:
    urlKeyMap = {
        someLocaleKey: {
            urlSegmentName1: this.renderAnchor.bind(config.someUrl),
            urlSegmentName2: this.renderAnchor.bind(config.someUrl2)
        }
    }

    render() {
        if (!warningController.current) return null;
        const key = warningController.current.content;
        let data = warningController.current.data || {};
        if (this.urlKeyMap[key]) {
            data = Object.assign(data, this.urlKeyMap[key]);
        }
        return (
            <div className={`snackbar-wrapper ${this.wrapperClass}`}>
                <div className={`snackbar ${this.snackbarClass}`}>
                    {t(key, data)}
                    {/* TODO make optional */}
                    {this.action !== null ?
                        <Button label={t(warningController.current.label || 'button_ok')} onClick={this.close} /> : null
                    }
                </div>
            </div>
        );
    }
}

module.exports = Snackbar;
