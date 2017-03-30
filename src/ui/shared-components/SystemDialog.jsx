const React = require('react');
const { Dialog } = require('~/react-toolbox');
const { observer } = require('mobx-react');
const { observable, computed, action } = require('mobx');
const { t } = require('peerio-translator');
const warningController = require('~/helpers/warning-controller');

@observer class SystemDialog extends React.Component {
    @observable active = false;
    @observable content;
    @observable action;
    @observable title;

    @computed get isVisible() {
        return warningController.hasVisibleDialog && !!warningController.current;
    }

    constructor() {
        super();
        this.hide = this.hide.bind(this);
    }

    componentWillMount() {
        warningController.registerComponent(this);
    }

    componentWillUnmount() {
        warningController.unregisterComponent(this);
    }

    @action hide() {
        if (warningController.current.action) {
            warningController.current.action();
        }
        console.log('next!')
        warningController.next();
    }

    render() {

        if (!warningController.current) return null;
        const actions = [
            { label: warningController.current.label || t('button_ok'), onClick: this.hide }
        ];
        return (
            <Dialog className="dialog-warning"
                    active={this.isVisible}
                    title={t(warningController.current.title)}
                    actions={actions}>
                {t(warningController.current.content, warningController.current.data)}
            </Dialog>
        );
    }
}

module.exports = SystemDialog;
