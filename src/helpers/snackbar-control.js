const { observable, computed } = require('mobx');
const { t } = require('peerio-translator');
const { serverWarnings } = require('../icebear');

class SnackbarControl {

    //@computed get isVisible() {
    //    return serverWarnings.current;
    //}
    //
    //@computed get content() {
    //    return t(serverWarnings.current.message, serverWarnings.current.data);
    //}
    //
    //@computed get label() {
    //    return t(serverWarnings.current.actionKey);
    //}

    mountedSnackbarComponents =[];

    messageQueue=[];
    position = 0;

    @observable isVisible = false;

    constructor() {
        this.next = this.next.bind(this);
    }

    /**
     * Add a message to the queue. Show if not currently visible.
     *
     * @param {Object} message
     */
    addMessage(message) {
        // todo validate translations
        this.messageQueue.push(message);
        if (!this.isVisible) {
            this.show();
        }
    }

    /**
     * Send current content to all mounted components.
     */
    populateComponents() {
        if (this.messageQueue[this.position]) {
            this.mountedSnackbarComponents.forEach((sComponent) => {
                sComponent.content = this.messageQueue[this.position].content;
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
        console.log('-------- register a component w location', snackbarComponent.props.location);
        this.mountedSnackbarComponents.push(snackbarComponent);
        this.populateComponents();
        if (this.mountedSnackbarComponents.length === 1) {
            console.log('only one component registered, so promote ', snackbarComponent.props.location)
            this.promoteComponent(snackbarComponent.props.location);
        }
    }

    /**
     * Used only if multiple mountedSnackbarComponents are mounted.
     *
     * @param {String} location
     */
    promoteComponent(location) {
        console.log('promote a component w location', location);
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
        //console.log('UNregister a component w location', snackbarComponent.props);
        this.mountedSnackbarComponents.forEach((sComponent, i) => {
            if (sComponent === snackbarComponent) {
                this.mountedSnackbarComponents.splice(i, 1);
                //console.log('components are now', this.mountedSnackbarComponents)
            }
        });
        const l = this.mountedSnackbarComponents.length;
        if (l > 0) {
            console.log('promote top component', this.mountedSnackbarComponents[l - 1].props.location)
            this.promoteComponent(this.mountedSnackbarComponents[l - 1].props.location);
        }

        // todo promote
    }
}

const s = new SnackbarControl();

setTimeout(() => {
    console.log('adding a snacky')
    s.addMessage({
        content: '1 - hsdaghfjgsdgfjhsd'
    });
    s.addMessage({
        content: '2 - 75fsadfkls dfsdfae8 rafdsfe5fds8grfasd 5sd4a'
    });
    s.addMessage({
        content: '3 - 14t5gsfv75fdffg'
    });
}, 3000);


setTimeout(() => {
    s.addMessage({
        content: '4 - hxxxxxxxxxhsd'
    });
}, 9000);

module.exports = s;


//
// text and visibility settings per snackbar
// show hide per snackbar
//
//
// message input -- component mount -> hide the ohter mountedSnackbarComponents
// component unmount -> show others
//
