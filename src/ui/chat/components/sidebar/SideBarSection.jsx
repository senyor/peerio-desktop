const React = require('react');
const { observable } = require('mobx');
const { observer } = require('mobx-react');
const { FontIcon } = require('~/react-toolbox');
const css = require('classnames');

@observer
class SideBarSection extends React.Component {
    @observable closed = false;

    toggleSection = () => {
        this.closed = !this.closed;
    }

    render() {
        return (
            <div className={css('sidebar-section', { closed: this.closed })} >
                <div className="list-header clickable" onClick={this.toggleSection}>
                    <div className="section-title">{this.props.title}</div>
                    <FontIcon value={this.closed ? 'arrow_drop_down' : 'arrow_drop_up'} />
                </div>
                {this.props.children}
            </div>
        );
    }
}

module.exports = SideBarSection;
