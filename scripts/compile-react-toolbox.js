/* eslint-disable */
const postcss = require('postcss');
const modules = require('postcss-modules');
const path = require('path');
const fs = require('fs');
const cp = require('child_process');
const writeFile = require('writefile');

const src = './app/node_modules/react-toolbox/components/';
const dst = './app/build/react-toolbox/';

cp.execSync('cp -Rf ./app/node_modules/react-toolbox/components/ ./app/node_modules/react-toolbox/lib' );
cp.execSync('babel ./app/node_modules/react-toolbox/components -d ./app/node_modules/react-toolbox/lib/');

function getJSONFromCssModules(cssFileName, json) {
    writeFile(`${cssFileName.substring(0, cssFileName.length - 4)}.json`, JSON.stringify(json));
}

function generateScopedName(name, fileName, css) {
    let file = path.basename(fileName, '.css');
    if (file === 'theme') file = ''; else file = '-' + file;
    let folder = path.basename(path.dirname(fileName));
    if (folder === 'lib') folder = ''; else folder = '-' + folder;
    return 'rt' + folder + file + '-' + name;
}

function compile(file) {
    const css = fs.readFileSync(src + file);
    postcss([
        require('postcss-import')(),
        require('postcss-mixins')(),
        require('postcss-each')(),
        require('postcss-cssnext')({
            features: {
                customProperties: {
                    variables: {
                        'color-primary': 'rgb(44, 149, 207)',
                        'color-primary-dark': 'var(--palette-indigo-700)',
                        'color-primary-light': 'var(--palette-indigo-500)',
                        'color-accent': 'var(--palette-pink-a200)',
                        'color-accent-dark': 'var(--palette-pink-700)',
                        'color-primary-contrast': 'var(--color-dark-contrast)',
                        'color-accent-contrast': 'var(--color-dark-contrast)',
                        'animation-duration': '0.3s'
                    }
                }
            }
        }),
        modules({
            getJSON: getJSONFromCssModules,
            generateScopedName: generateScopedName,
            scopeBehaviour: 'local'
        }),
        require('precss')(),
        require('postcss-reporter')()
    ]).process(css, {
        from: src + file,
        to: dst + file
    }).then((result) => {
        return writeFile(dst + file, result.css);
    });
}
[
    'commons.css',
    'animations/slide-left.css',
    'animations/slide-right.css',
    'animations/zoom-in.css',
    'animations/zoom-out.css',
    'app_bar/theme.css',
    'autocomplete/theme.css',
    'avatar/theme.css',
    'button/theme.css',
    'card/theme.css',
    'checkbox/theme.css',
    'chip/theme.css',
    'date_picker/theme.css',
    'dialog/theme.css',
    'drawer/theme.css',
    'dropdown/theme.css',
    'input/theme.css',
    'layout/theme.css',
    'link/theme.css',
    'list/theme.css',
    'menu/theme.css',
    'navigation/theme.css',
    'overlay/theme.css',
    'progress_bar/theme.css',
    'radio/theme.css',
    'ripple/theme.css',
    'slider/theme.css',
    'snackbar/theme.css',
    'switch/theme.css',
    'table/theme.css',
    'tabs/theme.css',
    'time_picker/theme.css',
    'tooltip/theme.css'
].forEach(f => compile(f));
