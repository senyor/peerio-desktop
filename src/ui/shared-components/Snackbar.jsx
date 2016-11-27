const React = require('react');
const { Button } = require('react-toolbox');
const { observer } = require('mobx-react');
const css = require('classNames');


@observer
class Snackbar extends React.Component {

    render() {
        return (
            <div className="snackbar-wrapper">
                <div className={css(this.props.className)}>
                    {this.props.content}
                    {/* TODO make optional */}
                    {this.props.label && this.props.action !== null ?
                        <Button label={this.props.label} onClick={this.props.action} /> : null
                    }
                </div>
            </div>
        );
    }
}

module.exports = Snackbar;
