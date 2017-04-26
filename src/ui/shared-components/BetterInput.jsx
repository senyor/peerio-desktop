const React = require('react');
const { observable } = require('mobx');
const { observer } = require('mobx-react');
const { Input } = require('~/react-toolbox');

@observer
class BetterInput extends React.Component {

    @observable value = '';
    accepted = false;
    rejected = false;
    focused = false;

    componentWillMount() {
        this.value = this.props.value || '';
    }
    componentWillReceiveProps(props) {
        this.value = props.value || '';
    }

    onChange = val => {
        this.value = val;

        if (this.props.onChange) this.props.onChange(val);
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
        this.focused = false;
        if (this.props.onBlur) this.props.onBlur();
        if (this.accepted || this.rejected) return;
        this.props.onAccept(this.inputRef.getWrappedInstance().inputNode.value);
        this.accepted = true;
    };

    onKeyDown = (e) => {
        if (e.key === 'Enter') {
            this.accepted = true;
            this.props.onAccept(this.value);
            this.inputRef.getWrappedInstance().blur();
        } if (e.key === 'Escape') {
            this.rejected = true;
            this.props.onReject();
            this.value = this.props.value || '';
            this.inputRef.getWrappedInstance().blur();
        }
    };

    cancel() {
        this.rejected = true;
    }

    setRef = (ref) => {
        if (ref) {
            this.inputRef = ref;
        }
    }

    focus() {
        if (this.inputRef) this.inputRef.getWrappedInstance().focus();
    }


    render() {
        const { onFocus, onBlur, onChange, onKeyDown, onAccept, onReject, value, ...props } = this.props;
        props.onFocus = this.onFocus;
        props.onBlur = this.onBlur;
        props.onChange = this.onChange;
        props.onKeyDown = this.onKeyDown;
        props.ref = this.setRef;
        props.value = this.value;
        return React.createElement(Input, props);
    }

}

module.exports = BetterInput;
