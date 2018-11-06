import path from 'path';
import { setAddon, storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs/react';
import JSXAddon from 'storybook-addon-jsx';

import '../../.storybook/storybook.css';

setAddon(JSXAddon);

const requireContext = require.context('./', /* subdirs= */ true, /-story\.jsx?$/);

requireContext.keys().forEach(packageName => {
  if (packageName !== 'shared') {
    const packageExport = requireContext(packageName);
    if (packageExport && packageExport.default && !Array.isArray(packageExport.default)) {
      const { examples } = packageExport.default;

      examples.forEach(example => {
        const {
          storyPath = 'Missing story path',
          storyName = 'Missing name',
          renderStory = () => 'Missing `renderStory`',
        } = example;

        storiesOf(storyPath, module)
          .addDecorator(withKnobs)
          .addWithJSX(storyName, renderStory);
      });
    }
  }
});
