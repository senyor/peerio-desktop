const React = require('react');
const { Button } = require('react-toolbox');
const { observer } = require('mobx-react');
const { observable, computed } = require('mobx');
const { t } = require('peerio-translator');
const css = require('classnames');
const snackbarControl = require('../../helpers/snackbar-control');

@observer
class Snackbar extends React.Component {

    @observable isForeground = false;
    @observable label = t('ok');
    @observable content;
    
    @computed get isVisible() {
        console.log(`${this.props.location} is visible? content=${this.content}, global vis=${snackbarControl.isVisible}, fg=${this.isForeground}`)
        return this.content && snackbarControl.isVisible && this.isForeground;
    }

    componentWillMount() {
        snackbarControl.registerComponent(this);
        if (this.props.priority > 0) {
            snackbarControl.promoteComponent(this.props.location);
        }
    }

    componentWillUnmount() {
        snackbarControl.unregisterComponent(this);
    }

    action = () => {
        return this.props.action || snackbarControl.next();
    };

    render() {
        return (
            <div className="snackbar-wrapper">
                <div className={css(`snackbar ${this.isVisible ? 'show' : ''}`)}>
                    {this.content}
                    {/* TODO make optional */}
                    {this.action !== null ?
                        <Button label={this.label} onClick={this.action} /> : null
                        }
                </div>
            </div>
        );
    }
}

module.exports = Snackbar;
