import React from 'react';
import { select } from '@storybook/addon-knobs/react';

export default {
  examples: [
    {
      storyPath: 'Test story',
      storyName: 'Story i',
      renderStory: () => <div>✨ ✨ ✨</div>,
    },
    {
      storyPath: 'Test story',
      storyName: 'Story ii',
      renderStory: () => <div>💸 💸 💸</div>,
    },
    {
      storyPath: 'Test story/nested',
      storyName: 'I am configurable!',
      renderStory: () => {
        const emoji = select('Emoji', ['✨', '🌈', '📺', '🍋'], '🌈');

        return (
          <div>
            {Array(10)
              .fill(null)
              .map(() => `${emoji} `)}
          </div>
        );
      },
    },
  ],
};
