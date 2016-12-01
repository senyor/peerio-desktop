/**
 * Component meant to live inside a form with a store.
 *
 * Given a store (OrderedFormStore) with observable x, aand configuring ValidatedInput
 * with name=x and some validator (and any additional properties desired), this
 * component will take care of validating the input on change and blur.
 * It will also create the following observables in the store:
 * - xValid
 * - xDirty
 *
 * .. for use outside of the ValidatedInput component (e.g. for computing
 * the validity of the form overall)
 *
 * Validators are expected to follow the format provided for them in the
 * icebear library.
 *
 *
 *
 */
const React = require('react');
const { extendObservable, observable, computed } = require('mobx');
const { Component } = require('react');
const { observer } = require('mobx-react');
const { Input } = require('react-toolbox');


@observer class ValidatedInput extends Component {

    @observable validationMessageText;

    @computed get validationMessage() {
        if (this.props.store[this.fDirty] === true) {
            return this.validationMessageText;
        }
        return '';
    }

    constructor() {
        // todo check if store exists and is the right type
        // check if value is an observable
        
        // set property names
        this.fName = this.props.name;
        this.fDirty = `${fName}Dirty`;
        this.fValid = `${fName}Valid`;
        const validationProps = {};

        // adds additional observables to the store
        validationProps[this.fValid] = false;
        validationProps[this.fDirty] = false;
        extendObservable(this.props.store, validationProps);
        // add the field order
        store.fieldOrders[fName] = this.props.position;
        autorun(() => this.validate);
        super();
    }

    validate() {
        const value = this.props.store[this.props.name];
        const fieldValidators = Array.isArray(this.props.validator) ?
            this.props.validator : [this.props.validator];

        fieldValidators.forEach(v => {
            valid = valid.then(r => {
                return r === true ? v.action(value, this.props.name).then(rs => (rs === true ? rs : v.message)) : r;
            });
        });
        valid = valid.then(v => {
            if (v === true) {
                store[this.fValid] = true;
                this.validationMessageText = '';
            } else {
                // note computed message will only how up if field is dirty
                store[this.fValid] = false;
                this.validationMessageText = v;
            }
        });
    }

    handleBlur = () => {
        this.props.store[this.fDirty] = true;
        // mark all subsequent
        if (this.props.position !== undefined) {
            _.each(store.fieldOrders, (otherPosition, otherField) => {
                if (otherPosition < positionInForm) {
                    store[`${otherField}Dirty`] = true;
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
                   validator={this.props.validator}
                   fieldName={this.props.name}
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

