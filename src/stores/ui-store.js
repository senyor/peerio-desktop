// global UI store
const { observable } = require('mobx');

class UIStore {
    @observable contactDialogUsername;
}

module.exports = new UIStore();
