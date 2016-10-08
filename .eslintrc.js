module.exports = {
    root: true,
    extends: [
        "peerio"
    ],
    settings:{
        "import/core-modules": [ "electron" ]
    },
    rules:{
        "react/jsx-indent": [2, 2]
    },
    globals:{
        document: false
    }
};
