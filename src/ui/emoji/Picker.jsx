/* eslint-disable react/no-multi-comp */
const React = require('react');
const { observable } = require('mobx');
const { observer } = require('mobx-react');
const css = require('classnames');
const data = require('~/static/emoji/emoji.json');
const _ = require('lodash');

data.recent = [];

const shortnameMap = {};
function buildMap() {
    const catKeys = Object.keys(data);
    for (let i = 0; i < catKeys.length; i++) {
        data[catKeys[i]].forEach(item => {
            shortnameMap[item.shortname] = item;
        });
    }
}

buildMap();

const categories = [
    { id: 'recent', name: 'Frequently Used' },
    { id: 'people', name: 'Smileys & People' },
    { id: 'nature', name: 'Animals & Nature' },
    { id: 'food', name: 'Food & Drink' },
    { id: 'activity', name: 'Activity' },
    { id: 'travel', name: 'Travel & Places' },
    { id: 'objects', name: 'Objects' },
    { id: 'symbols', name: 'Symbols' },
    { id: 'flags', name: 'Flags' }
];

// separate store is needed to avoid re-render of all emojis on hover
class PickerStore {
    @observable hovered = null;
}

const store = new PickerStore();

@observer
class Picker extends React.Component {
    @observable selectedCategory = categories[0].id;
    dontHide = false;

    onCategoryClick = id => {
        this.selectedCategory = id;
        document.getElementsByClassName(`category-header ${id}`)[0]
                .scrollIntoView({ block: 'start', behavior: 'smooth' });
    };

    resetHovered = () => {
        this.dontHide = false;
        setTimeout(() => {
            if (!this.dontHide)store.hovered = null;
        }, 2000);
    };

    handleScroll = _.throttle(() => {
        const candidates = [];
        let closest;
        const parent = document.getElementsByClassName(`emojis`)[0];
        for (let i = 0; i < categories.length; i++) {
            const c = document.getElementsByClassName(`category-header ${categories[i].id}`)[0];
            if (c.offsetTop > (parent.offsetHeight + parent.scrollTop)) continue;
            candidates.push({ id: categories[i].id, offsetTop: c.offsetTop });
        }
        closest = candidates[0];
        for (let i = 1; i < candidates.length; i++) {
            if (Math.abs(parent.scrollTop - closest.offsetTop) > Math.abs(parent.scrollTop - candidates[i].offsetTop)) {
                closest = candidates[i];
            }
        }
        if (this.selectedCategory !== closest.id) this.selectedCategory = closest.id;
    }, 1000);

    render() {
        return (
            <div className="emoji-picker">
                <div className="categories" key="categories">
                    {
                        categories.map(c =>
                            <Category id={c.id} key={c.id} selected={this.selectedCategory === c.id}
                                      name={c.name} onClick={this.onCategoryClick} />)
                    }
                </div>
                <div className="emojis" key="emojis" onScroll={this.handleScroll}>
                    {
                        categories.map(c =>
                            <div key={c.id}>
                                <div className={`category-header ${c.id}`}>{c.name}</div>
                                {data[c.id].map(e =>
                                    <span onMouseEnter={() => { this.dontHide = true; store.hovered = e.shortname; }}
                                          onMouseLeave={this.resetHovered}
                                          onClick={() => this.props.onPicked(e)}
                                          className={`emojione emojione-${e.unicode}`}
                                          key={e.unicode} />
                                )}
                            </div>
                        )
                    }
                </div>
                <InfoPane />
            </div>
        );
    }
}

@observer
class InfoPane extends React.Component {
    render() {
        if (!store.hovered) {
            return (
                <div className="info-pane default">
                    <span className="emojione emojione-1f446" /> Pick your emoji
                </div>
            );
        }
        const item = shortnameMap[store.hovered];
        return (
            <div className="info-pane">
                <span className={`emojione emojione-${item.unicode}`} />
                <div>
                    <span className="bold">{item.name}</span><br />
                    {item.shortname} {item.aliases}<br />
                    <span className="monospace">{item.aliases_ascii}</span>
                </div>
            </div>
        );
    }
}

function Category(props) {
    return (
        <img src={`static/img/emoji-categories/${props.id}.svg`}
             title={props.name} alt={props.name}
             className={css('category', { selected: props.selected })}
             onClick={() => props.onClick(props.id)} />
    );
}

module.exports = Picker;
