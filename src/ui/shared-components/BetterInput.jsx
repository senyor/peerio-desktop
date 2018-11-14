import React from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Input } from 'peer-ui';
import { t } from 'peerio-icebear';

@observer
class BetterInput extends React.Component {
    @observable value = '';
    @observable isValid = true;
    accepted = false;
    rejected = false;
    @observable focused = false;

    componentWillMount() {
        this.value = this.props.value || '';
    }
    componentWillReceiveProps(props) {
        this.value = props.value || '';
    }

    onChange = val => {
        this.value = val;
        if (this.props.validator) {
            const res = this.props.validator(val);
            if (res instanceof Promise) {
                res.then(valid => {
                    this.isValid = valid;
                    this.emitConsumerOnChange(val, valid);
                });
            } else {
                this.isValid = res;
                this.emitConsumerOnChange(val, res);
            }
        } else this.emitConsumerOnChange(val, true);
    };

    emitConsumerOnChange = (val, valid) => {
        if (!this.props.onChange) return;
        this.props.onChange(val, valid);
    };

    onFocus = () => {
        this.accepted = false;
        this.rejected = false;
        this.focused = true;
        if (this.props.onFocus) this.props.onFocus();
    };

    onBlur = () => {
        // WORKAROUND: under some circumstances like calling focus() on message input react calls false blur event
        if (!this.focused) return;
        if (this.props.acceptOnBlur === 'false' || !this.isValid) return;
        this.focused = false;
        if (this.props.onBlur) this.props.onBlur();
        if (this.accepted || this.rejected) return;
        this.props.onAccept(this.value, this.isValid);
        this.accepted = true;
    };

    onKeyDown = e => {
        if (e.key === 'Enter') {
            if (!this.isValid) return;
            this.accepted = true;
            this.props.onAccept(this.value, this.isValid);
            if (this.props.onBlur) this.props.onBlur();
        }
        if (e.key === 'Escape') {
            this.rejected = true;
            if (this.props.onReject) this.props.onReject();
            this.value = this.props.value || '';
            if (this.props.onBlur) this.props.onBlur();
        }
        if (this.props.onKeyDown) this.props.onKeyDown(e);
    };

    cancel() {
        this.rejected = true;
    }

    render() {
        const {
            onFocus,
            onBlur,
            onChange,
            onKeyDown,
            onAccept,
            onReject,
            value,
            acceptOnBlur,
            validator,
            error,
            displayValue,
            ...props
        } = this.props;
        props.onFocus = this.onFocus;
        props.onBlur = this.onBlur;
        props.onChange = this.onChange;
        props.onKeyDown = this.onKeyDown;
        props.value = this.focused ? this.value : displayValue || this.value;
        props.type = 'text';
        props.error = this.isValid ? '' : t(error);
        return React.createElement(Input, props);
    }
}

export default BetterInput;
