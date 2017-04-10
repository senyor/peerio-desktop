/* eslint-disable react/no-multi-comp */
const React = require('react');
const { observable, reaction, action } = require('mobx');
const { observer } = require('mobx-react');
const css = require('classnames');
const data = require('~/static/emoji/emoji.json');
const { FontIcon } = require('~/react-toolbox');
const _ = require('lodash');
const { t } = require('peerio-translator');
const { User } = require('~/icebear');

data.recent = observable([]);

const shortnameMap = {};
function buildMap() {
    const catKeys = Object.keys(data);
    for (let i = 0; i < catKeys.length; i++) {
        data[catKeys[i]].forEach(item => {
            shortnameMap[item.shortname] = item;
            item.className = `emojione emojione-${item.unicode}`;
        });
    }
}

buildMap();

const categories = [
    { id: 'recent', name: 'Recently Used' },
    { id: 'people', name: 'Smileys & People' },
    { id: 'nature', name: 'Animals & Nature' },
    { id: 'food', name: 'Food & Drink' },
    { id: 'activity', name: 'Activity' },
    { id: 'travel', name: 'Travel & Places' },
    { id: 'objects', name: 'Objects' },
    { id: 'symbols', name: 'Symbols' },
    { id: 'flags', name: 'Flags' }
];

let mruInitialized = false;
function initMRU() {
    if (mruInitialized || !User.current) return;
    mruInitialized = true;
    User.current.emojiMRU.list.observe(action(event => {
        data.recent.clear();
        event.object.forEach(shortname => {
            data.recent.push(shortnameMap[shortname]);
        });
    }), true);
}

// separate store is needed to avoid re-render of all emojis on hover
class PickerStore {
    @observable hovered = null;
}

const store = new PickerStore();

function skipNulls(i) {
    if (i === null) return false;
    return true;
}
@observer
class Picker extends React.Component {
    @observable selectedCategory = categories[0].id;
    @observable searchKeyword = '';

    dontHide = false;

    componentWillMount() {
        initMRU();
    }

    onCategoryClick = id => {
        const el = document.getElementsByClassName(`category-header ${id}`)[0];
        if (!el) return;
        this.selectedCategory = id;
        el.scrollIntoView({ block: 'start', behavior: 'smooth' });
    };

    resetHovered = () => {
        this.dontHide = false;
        setTimeout(() => {
            if (!this.dontHide) store.hovered = null;
        }, 2000);
    };

    onSearchKeywordChange = (val) => {
        this.searchKeyword = val;
    };

    handleScroll = _.throttle(() => {
        const candidates = [];
        let closest;
        const parent = document.getElementsByClassName(`emojis`)[0];
        for (let i = 0; i < categories.length; i++) {
            const c = document.getElementsByClassName(`category-header ${categories[i].id}`)[0];
            if (!c || c.offsetTop > (parent.offsetHeight + parent.scrollTop)) continue;
            candidates.push({ id: categories[i].id, offsetTop: c.offsetTop });
        }
        if (!candidates.length) return;
        closest = candidates[0];
        for (let i = 1; i < candidates.length; i++) {
            if (Math.abs(parent.scrollTop - closest.offsetTop) > Math.abs(parent.scrollTop - candidates[i].offsetTop)) {
                closest = candidates[i];
            }
        }
        if (this.selectedCategory !== closest.id) this.selectedCategory = closest.id;
    }, 1000);

    onEmojiMouseEnter = (e) => {
        this.dontHide = true;
        store.hovered = e.target.attributes['data-shortname'].value;
    };
    onPicked = (e) => {
        const shortname = e.target.attributes['data-shortname'].value;
        User.current.emojiMRU.addItem(shortname);
        this.props.onPicked(shortnameMap[shortname]);
    };
    preventBlur = () => {
        this.noBlur = true;
    };
    handleBlur = () => {
        if (this.noBlur) {
            this.noBlur = false;
            return;
        }
        this.props.onBlur();
    };
    render() {
        const searchLow = this.searchKeyword.toLowerCase();
        return (
            <div className="emoji-picker" onBlur={this.handleBlur} onMouseDown={this.preventBlur}>
                <div className="categories" key="categories">
                    {
                        categories.map(c =>
                            <Category id={c.id} key={c.id} selected={this.selectedCategory === c.id}
                                name={c.name} onClick={this.onCategoryClick} />)
                    }
                </div>
                <SearchEmoji searchKeyword={this.searchKeyword} onSearchKeywordChange={this.onSearchKeywordChange}
                    clearSearchKeyword={this.clearSearchKeyword} />
                <div className="emojis" key="emojis" onScroll={this.handleScroll}>
                    {
                        categories.map(c => {
                            return (<div key={c.id}>
                                <div className={`category-header ${c.id}`}>{c.name}</div>
                                {data[c.id].map(e =>
                                    e.index.indexOf(searchLow) < 0 ? null :
                                    <span onMouseEnter={this.onEmojiMouseEnter}
                                            onMouseLeave={this.resetHovered} onClick={this.onPicked}
                                            className={e.className}
                                            key={e.unicode} data-shortname={e.shortname} />
                                ).filter(skipNulls)}
                            </div>);
                        }).filter(item => item.props.children[1].length > 0)
                    }
                </div>
                <InfoPane />
            </div>
        );
    }
}

@observer
class SearchEmoji extends React.Component {
    @observable keyword = '';
    inputRef(ref) {
        if (ref) ref.focus();
    }
    onKeywordChange = (ev) => {
        this.keyword = ev.target.value;
        this.fireChangeEvent();
    };
    fireChangeEvent = _.throttle(() => {
        this.props.onSearchKeywordChange(this.keyword);
    }, 250);
    clearSearchKeyword = () => {
        this.keyword = '';
        this.fireChangeEvent();
    };
    render() {
        // Don't make IconButton out of clear search keyword button, it messes up blur event
        return (<div className="emoji-search">
            <FontIcon value="search" className="search-icon" />
            <input className="emoji-search-input" type="text" placeholder={t('title_search')}
                ref={this.inputRef}
                onChange={this.onKeywordChange} value={this.keyword} />
            {
                this.props.searchKeyword
                    ? <FontIcon className="clear-keyword-button"
                        value="highlight_off" onClick={this.clearSearchKeyword} />
                    : null
            }
        </div>);
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
                <span className={item.className} />
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
