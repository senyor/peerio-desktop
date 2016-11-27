/**
 Component meant to live inside a form store with @validateField
 */

const React = require('react');
const { Component } = require('react');
const { observer } = require('mobx-react');
const { Input } = require('react-toolbox');


@observer class ValidatedInput extends Component {
    render() {
        const s = this.props.store;
        const fieldName = this.props.name;
        const label = this.props.label;
        const type = this.props.type;

        return (
            <Input type={type || 'text'}
                   value={s[fieldName] || ''}
                   label={label}
                   onChange={s[`${fieldName}OnChange`]}
                   onBlur={s[`${fieldName}OnBlur`]}
                   error={s[`${fieldName}ValidationMessage`]}
            />
        );
    }
}
module.exports = ValidatedInput;

