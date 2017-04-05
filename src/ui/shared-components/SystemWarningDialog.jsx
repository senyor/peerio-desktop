const React = require('react');
const { Dialog } = require('~/react-toolbox');
const { observer } = require('mobx-react');
const { computed, action } = require('mobx');
const { t } = require('peerio-translator');
const warningController = require('~/helpers/warning-controller');
const { executeWarningAction, urlKeyMap } = require('~/helpers/warning-helpers');
const T = require('~/ui/shared-components/T');

@observer class SystemWarningDialog extends React.Component {

    @computed get isVisible() {
        return warningController.hasVisibleDialog && !!warningController.current;
    }

    componentWillMount() {
        warningController.registerComponent(this);
    }

    componentWillUnmount() {
        warningController.unregisterComponent(this);
    }

    @action.bound hide() {
        warningController.next();
    }

    render() {
        const w = warningController.current;
        if (!w) return null;
        const key = w.content;
        let data = w.data || {};

        // does server warning contain url?
        if (urlKeyMap[key]) {
            data = Object.assign(data, urlKeyMap[key]);
        }
        return (
            <Dialog className="dialog-warning"
                active={this.isVisible}
                title={t(w.title)}
                actions={this.getActions(w.buttons)}>
                <T k={key}>{data}</T>
            </Dialog>
        );
    }

    getActions(buttons) {
        const actions = [];
        if (buttons) {
            for (let i = 0; i < buttons.length; i++) {
                let label, wAction;
                if (typeof buttons[i] === 'string') {
                    label = buttons[i];
                    wAction = this.hide;
                } else {
                    label = buttons[i].label;
                    wAction = () => { executeWarningAction(buttons[i].action); this.hide(); };
                }
                actions.push({ label: t(label), onClick: wAction });
            }
        }
        if (!actions.length) {
            actions.push({ label: t('button_ok'), onClick: this.hide });
        }
        return actions;
    }
}

module.exports = SystemWarningDialog;
