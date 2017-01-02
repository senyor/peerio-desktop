const { observable, reaction } = require('mobx');
const { t } = require('peerio-translator');
const { systemWarnings } = require('~/icebear');

/**
 * Snackbar control contains:
 * - a queue of snackbar messages, including server warnings
 * - a priority system for snackbar components
 *
 * Snackbars are expected to be objects with properties:
 *  - content (String, translation key)
 *  - data (Object, fed to content translation -- optional)
 *  - label (String, translation key -- optional)
 *  - action (Function -- optional)
 *
 */
class SnackbarControl {

    mountedSnackbarComponents =[];
    messageQueue=[];
    position = 0;

    @observable isVisible = false;

    constructor() {
        this.next = this.next.bind(this);
        // add server warnings to the general snackbar pool
        reaction(() => systemWarnings.collection.length, (l) => {
            this.addMessage(systemWarnings.collection[l - 1]);
        });
    }

    /**
     * Add a message to the queue. Show if not currently visible.
     *
     * @param {Object} message
     */
    addMessage(message) {
        this.messageQueue.push(message);
        if (!this.isVisible) {
            this.show();
        }
    }

    /**
     * Send current content to all mounted components.
     */
    populateComponents() {
        const message = this.messageQueue[this.position];
        if (message) {
            this.mountedSnackbarComponents.forEach((sComponent) => {
                sComponent.content = t(message.content, message.data);
                sComponent.action = message.action;
                sComponent.label = t(message.label);
            });
        }
    }

    /**
     * Sends the message to all snackbar components.
     */
    show() {
        this.populateComponents();
        this.isVisible = true;
    }

    /**
     * If there is another message in the queue, show it. Otherwise hide & move position.
     */
    next() {
        this.isVisible = false;
        this.position += 1;
        if (this.messageQueue[this.position]) {
            this.show();
        }
    }

    /**
     * Register a snackbar instance.
     *
     * @param {Component} snackbarComponent
     */
    registerComponent(snackbarComponent) {
        this.mountedSnackbarComponents.push(snackbarComponent);
        this.populateComponents();
        if (this.mountedSnackbarComponents.length === 1) {
            this.promoteComponent(snackbarComponent.props.location);
        }
    }

    /**
     * Used only if multiple mountedSnackbarComponents are mounted.
     *
     * @param {String} location
     */
    promoteComponent(location) {
        this.mountedSnackbarComponents.forEach((sComponent) => {
            sComponent.isForeground = (sComponent.props.location === location);
        });
    }

    /**
     * Unregister a snackbar instance -- called on component unmount.
     *
     * @param {Component} snackbarComponent
     */
    unregisterComponent(snackbarComponent) {
        this.mountedSnackbarComponents.forEach((sComponent, i) => {
            if (sComponent === snackbarComponent) {
                this.mountedSnackbarComponents.splice(i, 1);
            }
        });
        // promote any remaining component
        const l = this.mountedSnackbarComponents.length;
        if (l > 0) {
            this.promoteComponent(this.mountedSnackbarComponents[l - 1].props.location);
        }
    }
}

const s = new SnackbarControl();

/**
 * SAMPLE USAGE
 */

/*
 setTimeout(() => {
     s.addMessage({
         content: 'hello I am a snackbar',
         label: 'go away'
     });
 }, 3000);
 */

module.exports = s;
