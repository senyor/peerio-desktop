const React = require('react');
const { observer } = require('mobx-react');

const Button = require('./Button');

@observer
class Chip extends React.Component {
    render() {
        return (
            <div
                className={
                    this.props.className
                        ? `p-chip ${this.props.className}`
                        : 'p-chip'
                }
            >
                <span className="content">{this.props.children}</span>
                {this.props.deletable
                    ? <Button
                        icon="remove"
                        onClick={this.props.onDeleteClick}
                        theme="small"
                    />
                    : null
                }
            </div>
        );
    }
}

module.exports = Chip;
