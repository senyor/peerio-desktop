import React from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

import { Input, InputProps } from 'peer-ui';
import { t, LocalizationStrings } from 'peerio-icebear';

interface BetterInputProps {
    validator?: (value: string) => boolean | Promise<boolean>;
    onChange?: (value: string, valid: boolean) => void;
    onAccept?: (value: string, valid: boolean) => void;
    onReject?: () => void;
    acceptOnBlur?: 'false';
    displayValue?: string;
    error?: keyof LocalizationStrings;
}

@observer
export default class BetterInput extends React.Component<BetterInputProps & InputProps> {
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

    onChange = (val: string) => {
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

    emitConsumerOnChange = (val: string, valid: boolean) => {
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
        if (this.props.onAccept) this.props.onAccept(this.value, this.isValid);
        this.accepted = true;
    };

    onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            if (!this.isValid) return;
            this.accepted = true;
            if (this.props.onAccept) this.props.onAccept(this.value, this.isValid);
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

        const inputProps = props as InputProps;

        (inputProps as any).type = 'text';
        inputProps.onFocus = this.onFocus;
        inputProps.onBlur = this.onBlur;
        inputProps.onChange = this.onChange;
        inputProps.onKeyDown = this.onKeyDown;
        inputProps.value = this.focused ? this.value : displayValue || this.value;

        // FIXME: why make this inconsistent with usage of the base Input
        // component? it also seems to be considered an optional prop anyway --
        // this'll cause nullability errors later.
        inputProps.error = this.isValid ? '' : (t(error) as string);

        return React.createElement(Input, props);
    }
}
