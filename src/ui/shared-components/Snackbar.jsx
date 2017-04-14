const React = require('react');
const { Button } = require('~/react-toolbox');
const { observer } = require('mobx-react');
const { observable, computed, reaction, action } = require('mobx');
const { t } = require('peerio-translator');
const warningController = require('~/helpers/warning-controller');
const { executeWarningAction, urlKeyMap } = require('~/helpers/warning-helpers');
const T = require('~/ui/shared-components/T');

@observer class Snackbar extends React.Component {
    // whether this particular snackbar instance is foregrounded
    // todo: this is set externally from warning-controller! disgusting! fix this!
    @observable isForeground = false;
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
        // handle animation
        reaction(() => this.isVisible, (visible) => {
            if (visible) {
                this.fadeIn();
            } else {
                this.animateDismiss();
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
    @action.bound fadeIn() {
        setTimeout(() => {
            this.wrapperClass = '';
            setTimeout(() => {
                this.snackbarClass = 'show';
                if (this.autoDismiss) {
                    setTimeout(() => {
                        this.close();
                    }, 6000);
                }
            }, 5);
        }, 200); // must happen *after* fadeOut
    }

    /**
     *  Animate fadeOut and dismiss warning.
     **/
    @action.bound animateDismiss() {
        this.snackbarClass = '';
        setTimeout(() => {
            this.wrapperClass = 'banish';
            warningController.next();
        }, 150);
    }

    /**
     *  Hide the snackbar. Will trigger fadeout.
     **/
    @action.bound close() {
        this.isLocallyVisible = false;
    }

    render() {
        const w = warningController.current;
        if (!w) return null;

        const key = w.content;
        const data = w.data || {};

        return (
            <div className={`snackbar-wrapper ${this.wrapperClass}`}>
                <div className={`snackbar ${this.snackbarClass}`}>
                    <T k={key}>{data}</T>
                    {this.renderButtons(w.buttons)}
                </div>
            </div>
        );
    }

    renderButtons(buttons) {
        const btnElems = [];
        if (buttons) {
            for (let i = 0; i < buttons.length; i++) {
                let label, wAction;
                if (typeof buttons[i] === 'string') {
                    label = buttons[i];
                    wAction = this.close;
                } else {
                    label = buttons[i].label;
                    wAction = () => { executeWarningAction(buttons[i].action); this.close(); };
                }

                btnElems.push(<Button key={label} label={t(label)} onClick={wAction} />);
            }
        }
        if (!btnElems.length) {
            btnElems.push(<Button key="button_ok" label={t('button_ok')} onClick={this.close} />);
        }
        return btnElems;
    }
}

module.exports = Snackbar;
