import { configure } from '@storybook/react';

function loadStorybook() {
  require('../storybook/storybookInfo');
  require('../storybook/stories');
  // require as many files as needed
}

configure(loadStorybook, module);
