import React from 'react';
import ConfigureCORS from './ConfigureCORS';

export default [
  {
    renderStory: () => <ConfigureCORS />,
    storyName: 'Configure CORS',
    storyPath: '@superset-ui/connection',
  },
];
