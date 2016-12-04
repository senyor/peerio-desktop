/**
 * Placeholder of things to come, and also makes the dev aware that
 * a store is related to ValidatedInputs on the component.
 */
const { observable } = require('mobx');

class OrderedFormStore {
    /**
     * Set to true by ValidatedInput once it has finished extending the store.
     * May be useful to trigger computed() which contains observables
     * that rely on observables created by ValidatedInput -- ie. they would
     * not have been available on creation of the store.
     *
     * @type {boolean}
     */
    @observable initialized = false;

    /**
     * Populated (optionally) by validated inputs in order to mark fields
     * that precede another field to be marked as dirty.
     *
     * @type {Object}
     */
    fieldOrders = {};
}

module.exports = OrderedFormStore;
