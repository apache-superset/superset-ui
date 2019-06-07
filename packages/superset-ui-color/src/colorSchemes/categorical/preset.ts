/* eslint-disable sort-keys */

import CategoricalScheme from '../../CategoricalScheme';

const schemes = [
  {
    id: 'presetColors',
    colors: [
      '#2FC096', // Leap
      '#FFF17E', // Shine
      '#BFE9E9', // Float
      '#484E5A', // Drive
      '#F77278', // Spawn
    ],
  },
].map(s => new CategoricalScheme(s));

export default schemes;
