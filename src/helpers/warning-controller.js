const { observable, reaction, computed, action } = require('mobx');
const { systemWarnings } = require('~/icebear');
const { BrowserWindow } = require('electron').remote;

/**
 * Snackbar control contains:
 * - a queue of snackbar messages, including server warnings
 * - a priority system for snackbar & components, which are mounted several times,
 *      as well as a  systemdialog component
 *
 * Snackbars are expected to be objects with properties:
 *  - content (String, translation key)
 *  - data (Object, fed to content translation -- optional)
 *  - label (String, translation key -- optional)
 *  - action (Function -- optional)
 *  - level (String -- "severe" will render the warning as a dialog)
 *  - title (String, translation key -- severe only)
 *
 */
class WarningController {

    mountedWarningComponents=[];

    @observable isVisible = false;
    @observable hasVisibleDialog = false;
    @observable hasVisibleSnackbar = false;

    @computed get current() {
        return systemWarnings.collection.length ? systemWarnings.collection[0] : null;
    }

    constructor() {
        this.next = this.next.bind(this);

        reaction(() => this.current, (current) => {
            if (current) this.show();
        });
    }

    /**
     * Sends the message to all snackbar components.
     */
    @action show() {
        if (this.current) {
            this.hasVisibleDialog = this.current.level === 'severe';
            this.hasVisibleSnackbar = this.current.level !== 'severe';
            this.mountedWarningComponents.forEach((sComponent) => {
                // properties only apply to snackbars
                sComponent.isLocallyVisible = true; // needed for fade effect
                sComponent.autoDismiss = BrowserWindow.getFocusedWindow();
            });
        }
    }

    /**
     * If there is another message in the queue, show it. Otherwise hide & move position.
     */
    @action next() {
        systemWarnings.shift();
        this.show();
    }

    /**
     * Register a snackbar or systemdialog instance.
     *
     * @param {Component} component
     */
    registerComponent(component) {
        this.mountedWarningComponents.push(component);
        if (this.mountedWarningComponents.length === 1) {
            this.promoteComponent(component.props.location);
        }
    }

    /**
     * Used only if multiple mountedWarningComponents are mounted.
     *
     * @param {String} location
     */
    promoteComponent(location) {
        this.mountedWarningComponents.forEach((sComponent) => {
            sComponent.isForeground = (sComponent.props.location === location);
        });
    }

    /**
     * Unregister a snackbar instance -- called on component unmount.
     *
     * @param {Component} component
     */
    unregisterComponent(component) {
        this.mountedWarningComponents.forEach((sComponent, i) => {
            if (sComponent === component) {
                this.mountedWarningComponents.splice(i, 1);
            }
        });
        // promote any remaining component
        const l = this.mountedWarningComponents.length;
        if (l > 0) {
            this.promoteComponent(this.mountedWarningComponents[l - 1].props.location);
        }
    }
}

const s = new WarningController();

// SAMPLE USAGE 

 setTimeout(() => {
    systemWarnings.add({
        content: 'hello I am a snackbar'
    });
 }, 1100);

 setTimeout(() => {
     systemWarnings.add({
        content: 'hello I am a DIALOG, no snackbar until i am gone',
        label: 'go away',
        level: 'severe'
    });
 }, 3000);


module.exports = s;
