import React from 'react';
import formatForReact from '../../src/utils/formatForReact';

describe('formatForReact(formatString, args)', () => {
  it('returns an array of React elements', () => {
    expect(formatForReact('a %s', <span>test</span>)).toEqual([
      'a ',
      <span>test</span>
    ])
  });
});
