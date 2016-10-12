const { configure } = require( '@kadira/storybook');

function loadStories() {
  require('./stories/index.js');
}
configure(loadStories, module);
