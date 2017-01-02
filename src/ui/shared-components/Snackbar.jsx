const React = require('react');
const { Button } = require('react-toolbox');
const { observer } = require('mobx-react');
const { observable, computed, reaction } = require('mobx');
const { t } = require('peerio-translator');
const css = require('classnames');
const snackbarControl = require('~/helpers/snackbar-control');

@observer class Snackbar extends React.Component {

    @observable isForeground = false;
    @observable label = t('ok');
    @observable content;
    @observable action;
    @observable snackbarClass = '';
    @observable wrapperClass = 'banish';

    @computed get isVisible() {
        return this.content && snackbarControl.isVisible && this.isForeground;
    }

    constructor() {
        super();

        reaction(() => this.isVisible, (visible) => {
            if (visible) {
                this.fadeIn();
            } else {
                this.fadeOut();
            }
        });
    }

    componentWillMount() {
        snackbarControl.registerComponent(this);
        if (this.props.priority > 0) {
            snackbarControl.promoteComponent(this.props.location);
        }
    }

    componentWillUnmount() {
        snackbarControl.unregisterComponent(this);
    }

    /**
     *  Animate fadeIn.
     **/
    fadeIn = () => {
        setTimeout(() => {
            this.wrapperClass = '';
            setTimeout(() => {
                this.snackbarClass = 'show';
            }, 5);
        }, 200); // must happen *after* fadeOut
    };

    /**
     *  Animate fadeOut
     **/
    fadeOut = () => {
        this.snackbarClass = '';
        setTimeout(() => {
            this.wrapperClass = 'banish';
        }, 150);
    };

    /**
     *  Run action, if it exists, and call up the next snackbar, if it exists.
     **/
    dismiss = () => {
        if (this.action) {
            this.action();
        }
        snackbarControl.next();
    };

    render() {
        return (
            <div className={css(`snackbar-wrapper ${this.wrapperClass}`)}>
                <div className={css(`snackbar ${this.snackbarClass}`)}>
                    {this.content}
                    {/* TODO make optional */}
                    {this.action !== null ?
                        <Button label={this.label || t('ok')} onClick={this.dismiss} /> : null
                        }
                </div>
            </div>
        );
    }
}

module.exports = Snackbar;
