/**
 * Sounds module.
 */

// 1. add file to static/snd
// 2. add file name here
const files = {
    ack: true,
    sending: true,
    sent: true,
    received: true,
    destroy: true
};

class Sound {
    node: HTMLAudioElement;

    constructor(id: string) {
        this.node = document.createElement('audio');
        this.node.src = `static/snd/${id}.ogg`;
    }

    play() {
        return this.node.play();
    }

    get volume() {
        return this.node.volume;
    }

    set volume(val: number) {
        this.node.volume = val;
    }
}

const sounds = {} as { [k in keyof typeof files]: Sound };

Object.keys(files).forEach(id => {
    sounds[id] = new Sound(id);
});

export default sounds;
