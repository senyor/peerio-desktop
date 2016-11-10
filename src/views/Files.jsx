const React = require('react');
const { withRouter } = require('react-router');
const { Component } = require('react');
const { Checkbox, IconButton, IconMenu, MenuItem } = require('react-toolbox');
const { observable, computed } = require('mobx');
const { observer } = require('mobx-react');
const Search = require('../components/Search');
const css = require('classnames');


const data = [
  { name: 'Cupcake', calories: 305, fat: 3.7, sodium: 413, calcium: '3%', iron: '8%' },
  { name: 'Donut', calories: 452, fat: 25.0, sodium: 326, calcium: '2%', iron: '22%' },
  { name: 'Eclair', calories: 262, fat: 16.0, sodium: 337, calcium: '6%', iron: '7%' },
  { name: 'Frozen yogurt', calories: 159, fat: 6.0, sodium: 87, calcium: '14%', iron: '1%' },
  { name: 'Gingerbread', calories: 356, fat: 16.0, sodium: 327, calcium: '7%', iron: '16%' },
  { name: 'Ice cream sandwich', calories: 237, fat: 9.0, sodium: 129, calcium: '8%', iron: '1%' },
  { name: 'Jelly bean', calories: 375, fat: 0.0, sodium: 50, calcium: '0%', iron: '0%' },
  { name: 'KitKat', calories: 518, fat: 26.0, sodium: 54, calcium: '12%', iron: '6%' }
];

const sortByCaloriesAsc = (a, b) => {
    if (a.calories < b.calories) return -1;
    if (a.calories > b.calories) return 1;
    return 0;
};

const sortByCaloriesDesc = (a, b) => {
    if (a.calories > b.calories) return -1;
    if (a.calories < b.calories) return 1;
    return 0;
};


@observer class Files extends Component {
    // TODO make dynamic based on file(s) selected
    @observable active = true;

    state = {
        selected: ['Donut'],
        sorted: 'asc'
    };

    getSortedData = () => {
        const compare = this.state.sorted === 'asc' ? sortByCaloriesAsc : sortByCaloriesDesc;
        return data.sort(compare);
    }

    handleRowSelect = selected => {
        const sortedData = this.getSortedData();
        this.setState({ selected: selected.map(item => sortedData[item].name) });
    };

    handleSortClick = () => {
        const { sorted } = this.state;
        const nextSorting = sorted === 'asc' ? 'desc' : 'asc';
        this.setState({ sorted: nextSorting });
    };

    render() {
        return (
            <div className="files">
              <div className="table-wrapper">
                <div className="header-filter">All files
                  <IconMenu icon="filter_list">
                    <MenuItem>Filter 1</MenuItem>
                  </IconMenu>
                </div>
                <div className="shadow-2">
                  <div className="table-action-bar">
                    <div>0 selected</div>
                    <div className="table-actions">
                      <IconButton icon="cloud_upload"
                        className={css({ active: this.active })} />
                      <IconButton icon="file_download"
                        className={css({ active: this.active })} />
                      <IconButton icon="reply"
                        className={css('reverse-icon', { active: this.active })} />
                      <IconButton icon="create_new_folder"
                        className={css({ active: this.active })} />
                      <IconButton icon="delete"
                        className={css({ active: this.active })} />
                    </div>
                    <Search />
                  </div>
                  <table>
                    <thead>
                      <tr>
                        <th><Checkbox /></th>
                        <th>Name</th>
                        <th>Owner</th>
                        <th>Modified</th>
                        <th>Size</th>
                        <th>Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><Checkbox /></td>
                        <td>Name</td>
                        <td>Owner</td>
                        <td>Modified</td>
                        <td>Size</td>
                        <td>Type</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
        );
    }
}

module.exports = withRouter(Files);
