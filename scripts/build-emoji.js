#!/usr/bin/env node
const fs = require('fs');
const cp = require('child_process');

const srcImages = './node_modules/emojione-assets/png/32/';
const srcSprites = './node_modules/emojione-assets/sprites/*-32-*@2x.png';
const srcCss = './node_modules/emojione-assets/sprites/emojione-sprite-32.css';
const srcJson = './node_modules/emojione/emoji.json';
const srcJs = './node_modules/emojione/lib/js/emojione.js';
const out = './src/static/emoji/';

// "has_img_emojione": false

// We need this so we can detect when new category has been added, it requires manual actions.
// Value should be an ascending index.
const knownCategories = {
    people: 1,
    activity: 1,
    food: 1,
    objects: 1,
    nature: 1,
    travel: 1,
    symbols: 1,
    regional: 1,
    flags: 1
};

// Preparing data
let resultCount = 0;
let raw = fs.readFileSync(srcJson, { encoding: 'utf8' });
raw = JSON.parse(raw);

checkConsistencyWithLib();
convertToArray();

console.log(`Raw data source contains ${raw.length} records`);
const origCount = raw.length;

groupByCategory();

if (origCount !== resultCount) {
    throw new Error(`Something went wrong. Original file had ${origCount} emojis. Result file: ${resultCount}`);
}
// -- Writing out data

cleanOutputDir();
fs.writeFileSync(`${out}emoji.json`, JSON.stringify(raw));

// copy sprites
console.log('Optimising and copying sprites.');
// cp.execSync(`pngquant ${srcSprites} -o ${out}emojione.sprites.png`);
fs.mkdirSync(`${out}sprites`);
cp.execSync(`cp ${srcSprites} ${out}sprites`);
cp.execSync(`cp ${srcJs} ${out}emojione.js`);
let css = fs.readFileSync(srcCss, 'utf8');
let repl;
// eslint-disable-next-line
while (true) {
    repl = css.replace(
        '@media only screen and (-webkit-min-device-pixel-ratio: 2),\nonly screen and (min-device-pixel-ratio: 2)',
        '@media all');
    if (repl !== css) {
        css = repl;
        continue;
    }
    break;
}
fs.writeFileSync(`${out}sprites/emojione.css`, css);
// cp.execSync(`cp ${srcCss} ${out}/sprites`);
// cp.execSync(`echo ".emoji-picker $(cat ${srcCss})" > ${out}sprites/emojione.sprites.css`);

console.log('Copying images.');
cp.execSync(`cp -R ${srcImages} ${out}png`);

// ---------------------------------------------------------------------------------------------------------------
function cleanOutputDir() {
    if (fs.existsSync(out)) cp.execSync(`rm -rf ${out}`);
    fs.mkdirSync(out);
    fs.writeFileSync(`${out}README.md`, '```\r\nThis directory is wiped and re-generated on build.\r\n' +
        'Do not add or modify files manually\r\n```');
}

function convertToArray() {
    console.log('Converting raw emoji data to array.');
    const arr = [];
    const keys = Object.keys(raw);
    for (let k = 0; k < keys.length; k++) {
        const item = raw[keys[k]];
        if (item.category === 'regional') {
            item.category = 'flags';
            item.origCategory = 'regional';
        }
        if (item.category === 'modifier') continue;
        item.index = `${item.name} `;
        item.index += `${item.shortname} `;
        item.index += `${item.keywords.join(' ')} `;
        item.index += `${item.shortname_alternates.join(' ')} `;
        item.index += `${item.ascii.join(' ')} `;
        item.index = item.index.toLowerCase();

        item.aliases = item.shortname_alternates.slice(0, 2).join('  ');
        item.ascii = item.ascii.slice(0, 2).join('  ');
        item.unicode = keys[k];

        delete item.shortname_alternates;
        delete item.keywords;
        delete item.display;
        delete item.code_points;
        // delete item.diversity;
        // delete item.diversities;
        delete item.gender;
        delete item.genders;


        arr.push(item);
    }
    arr.sort((a, b) => a.order > b.order ? 1 : (a.order === b.order ? 0 : -1)); //eslint-disable-line

    raw = arr;
}

function groupByCategory() {
    console.log('Grouping emojis by category');
    const grouped = {};
    const cats = Object.keys(knownCategories);
    for (let i = 0; i < cats.length; i++) {
        grouped[cats[i]] = [];
    }

    raw.forEach(item => {
        if (typeof knownCategories[item.category] === 'undefined') {
            throw new Error(`Unknown category detected: ${item.category}`);
        }

        grouped[item.category].push(item);
        resultCount++;
    });

    raw = grouped;
}

// checks if emoji.json and precompiled emojione library have the same emojis
// well, technically we don't check if library has more then data, but it's very unlikely
// and it won't cause issues if it happens
function checkConsistencyWithLib() {
    const lib = require('emojione');
    const keys = Object.keys(raw);
    for (let i = 0; i < keys.length; i++) {
        if (lib.emojioneList[raw[keys[i]].shortname]) continue;
        console.log(`${keys[i]} is missing from emojione lib.`);
        delete raw[keys[i]];
    }
}
