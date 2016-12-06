/**
 * Component meant to live inside a form with a store.
 *
 * Given a store (OrderedFormStore) with observable x, aand configuring ValidatedInput
 * with name=x and some validator (and any additional properties desired), this
 * component will take care of validating the input on change and blur.
 * It will also create the following observables in the store:
 * - ${x}Valid
 * - ${x}Dirty
 *
 * .. for use outside of the ValidatedInput component (e.g. for computing
 * the validity of the form overall)
 *
 * Validators are expected to follow the format specified in peerio-icebear
 */
const React = require('react');
const _ = require('lodash');
const { socket } = require('../../icebear'); // eslint-disable-line
const { extendObservable, observable, computed, reaction, when, isObservable } = require('mobx');
const { Component } = require('react');
const { observer } = require('mobx-react');
const { Input } = require('react-toolbox');
const OrderedFormStore = require('../../stores/ordered-form-store');

@observer class ValidatedInput extends Component {

    @observable validationMessageText;

    @computed get validationMessage() {
        if (this.props.store[this.fDirty] === true) {
            return this.validationMessageText;
        }
        return '';
    }

    constructor(props) {
        super(props);

        if (!(this.props.store.constructor.prototype instanceof OrderedFormStore)) {
            throw new Error('ValidatedInput expects a store property that inherits from OrderedFormStore');
        }

        if (!this.props.name) {
            throw new Error('ValidatedInput expects a name property');
        }

        if (!isObservable(this.props.store, this.props.name)) {
            throw new Error(`ValidatedInput expects ${this.props.name} to be an observable property in the store`);
        }

        // set property names
        this.fName = this.props.name;
        this.fDirty = `${this.fName}Dirty`;
        this.fValid = `${this.fName}Valid`;
        const validationProps = {};

        // adds additional observables to the store
        validationProps[this.fValid] = false;
        validationProps[this.fDirty] = false;
        extendObservable(this.props.store, validationProps);
        // add the field order
        this.props.store.fieldOrders[this.fName] = this.props.position;
        // alert the store that the above are available -- use in computeds
        this.props.store.initialized = true;

        this.validate = () => {
            when(() => socket.connected, () => this.validateConnected());
        };
    }

    componentWillMount() {
        reaction(() => this.props.store[this.props.name], () => this.validate(), true);
    }

    validateConnected() {
        const value = this.props.store[this.props.name];
        console.log(`ValidatedInput.jsx: ${value}, ${this.props.name}`);
        const fieldValidators = Array.isArray(this.props.validator) ?
            this.props.validator : [this.props.validator];

        Promise.reduce(fieldValidators, (r, validator) => {
            if (r === true) {
                return validator.action(value, this.props.validationArguments || {})
                    .then(rs => {
                        if (rs === true) {
                            return rs;
                        }
                        return (rs.message ? rs.message : validator.message);
                    });
            }
            return r;
        }, true)
            .then(v => {
                if (v === true) {
                    console.log(`ValidatedInput.jsx: ${value}, ${this.props.name} is valid`);
                    this.props.store[this.fValid] = true;
                    this.validationMessageText = '';
                } else {
                    console.log(`ValidatedInput.jsx: ${value}, ${this.props.name} is invalid`);
                    // computed message will only how up if field is dirty
                    this.props.store[this.fValid] = false;
                    this.validationMessageText = v;
                }
            });
    }

    handleBlur = () => {
        this.props.store[this.fDirty] = true;
        // mark all subsequent as dirty
        if (this.props.position !== undefined) {
            _.each(this.props.store.fieldOrders, (otherPosition, otherField) => {
                if (otherPosition < this.props.position) {
                    this.props.store[`${otherField}Dirty`] = true;
                }
            });
        }
    };

    handleChange = (val) => {
        this.props.store[this.fName] = val;
        this.props.store[this.fDirty] = true;
    };

    render() {
        return (
            <Input type={this.props.type || 'text'}
                   value={this.props.store[this.props.name] || ''}
                   label={this.props.label}
                   onChange={this.handleChange}
                   onKeyPress={this.props.onKeyPress}
                   onBlur={this.handleBlur}
                   error={this.validationMessage}
                   className={this.props.className}
            />
        );
    }
}
module.exports = ValidatedInput;

