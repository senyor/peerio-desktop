import React from 'react';

function a(text: string, url: string) {
    return (
        <a key={url} href={url}>
            {text}
        </a>
    );
}

function b(text: string) {
    return <strong>{text}</strong>;
}

function i(text: string) {
    return <i>{text}</i>;
}

function br() {
    return <br />;
}

// We export an object that can be iterated with Object.entries to register handlers.
export default {
    a,
    b,
    i,
    br
};
