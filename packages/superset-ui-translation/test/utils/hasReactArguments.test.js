import React from 'react';
import hasReactArguments from '../../src/utils/hasReactArguments';

describe('hasReactArguments(args)', () => {
  it('returns true when some of the arguments is a React element', () => {
    expect(hasReactArguments([1, 2, (<span>test</span>)])).toEqual(true);
  });
  it('returns false otherwise', () => {
    expect(hasReactArguments([1, 2, 3])).toEqual(false);
  });
});
