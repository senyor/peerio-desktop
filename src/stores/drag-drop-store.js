const { observable } = require('mobx');
const { User, fileStore } = require('~/icebear');

class DragDropStore {
    @observable hovering;
    @observable hoveringFileCount = 0;
    counter = 0;

    onEnter = (ev) => {
        ev.preventDefault();
        if (!User.current) return;
        this.counter++;
        if (this.counter === 1) {
            this.hovering = true;
            this.hoveringFileCount = ev.dataTransfer.files.length;
        }
        console.log(this.counter);
    };

    onLeave = (ev) => {
        ev.preventDefault();
        if (!User.current) return;
        if (this.counter > 0) this.counter--;
        if (this.counter === 0) this.hovering = false;
        console.log(this.counter);
    };

    onDrop = (ev) => {
        ev.preventDefault();
        if (!User.current) return;
        this.counter = 0;
        this.hovering = false;
        this.hoveringFileCount = 0;
        for (let i = 0; i < ev.dataTransfer.files.length; i++) {
            fileStore.upload(ev.dataTransfer.files[i].path);
        }
    };
}

const store = new DragDropStore();
window.addEventListener('drop', store.onDrop, false);
window.addEventListener('dragenter', store.onEnter, false);
window.addEventListener('dragleave', store.onLeave, false);
window.addEventListener('dragover', (ev) => { ev.preventDefault(); }, false);

module.exports = store;
