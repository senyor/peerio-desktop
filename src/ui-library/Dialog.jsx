const React = require('react');
const ReactDOM = require('react-dom');

const { action, observable, reaction } = require('mobx');
const { observer } = require('mobx-react');

const css = require('classnames');
const Button = require('./Button');

const appRoot = document.getElementById('root');

/*
    PROPS           type        description
    ----------------------------------------
    className       string
    active          bool

    title                       usually string but any HTML allowed

    actions         array       each element is object with {label: string, onClick: function}
    onCancel        function
    ----------------------------------------
*/

@observer
class Dialog extends React.Component {
    // Separate "rendered" and "visible" bools to be able to use fade in/out animations
    @observable dialogRendered = false;
    @observable dialogVisible = false;

    componentDidMount() {
        /*
            These awkward timeouts are used to stagger the dialog's render event from its "make visible" event.
            The .visible class is tied to the dialogVisible bool, which is what triggers the opacity transition.
            Separating these two events ensures that the transition plays.
        */
        this.activeReaction = reaction(() => this.props.active, active => {
            if (active) {
                this.setActive();
            } else {
                this.setInactive();
            }
        });

        /*
            If, on mount, dialog is already active, reaction() won't cause dialog to show. Need to set the bools here.
            e.g. this happens in Files > MoveFileDialog, where Dialog itself is 2 components removed from `active` bool
        */
        if (this.props.active) {
            this.dialogRendered = true;
            this.dialogVisible = true;
            window.addEventListener('keyup', this.handleEscKey, false);
        }
    }

    componentWillUnmount() {
        this.activeReaction();
        window.removeEventListener('keyup', this.handleEscKey);
    }

    @action.bound setActive() {
        this.dialogRendered = true;
        window.addEventListener('keyup', this.handleEscKey, false);

        if (this.unmountTimeout) clearTimeout(this.unmountTimeout);
        setTimeout(() => {
            this.dialogVisible = true;
        }, 1);
    }

    @action.bound setInactive() {
        this.dialogVisible = false;
        window.removeEventListener('keyup', this.handleEscKey);

        this.unmmountTimeout = setTimeout(() => {
            this.dialogRendered = false;
            this.unmmountTimeout = null;
        }, 200);
    }

    @action.bound handleEscKey(ev) {
        if (ev.keyCode === 27) {
            this.props.onCancel();
        }
    }

    render() {
        if (!this.dialogRendered) return null;

        const { actions } = this.props;
        const buttons = [];

        if (actions) {
            for (let i = 0; i < actions.length; i++) {
                buttons.push(
                    <Button
                        key={`p-dialog-button-${i}`}
                        label={actions[i].label}
                        onClick={actions[i].onClick}
                        theme={i < actions.length - 1 ? 'secondary' : null}
                    />
                );
            }
        }

        const dialogContent = (
            <div
                className={css(
                    'p-dialog-wrapper',
                    { visible: this.dialogVisible }
                )}
            >
                <div
                    className="p-dialog-overlay"
                    onClick={this.props.onCancel}
                />

                <div
                    className={css(
                        'p-dialog',
                        this.props.className
                    )}
                >
                    <div className="body">
                        {this.props.title
                            ? <div className="title">{this.props.title}</div>
                            : null
                        }
                        {this.props.children}
                    </div>

                    {this.props.actions
                        ? <div className="actions">{buttons}</div>
                        : null
                    }
                </div>
            </div>
        );


        return ReactDOM.createPortal(
            dialogContent,
            appRoot
        );
    }
}

module.exports = Dialog;
