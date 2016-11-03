const { observable, action } = require('mobx');

let count = 0;

class Contact {
    @observable loading=false;
    @observable notFound= false;
    @observable firstName ='';
    @observable lastName = '';

    constructor(username) {
        this.username = username;
    }

    load() {
        this.loading = true;
        setTimeout(action(() => {
            this.firstName = `First${count++}`;
            this.lastName = `First${count++}`;
            this.loading = false;
        }), Math.random() * 1500);
        return this;
    }
}

module.exports = Contact;
