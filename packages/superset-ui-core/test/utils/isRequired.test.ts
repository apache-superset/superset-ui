import { isRequired } from '@superset-ui/core';

describe('isRequired(field)', () => {
  it('should throw error with the given field in the message', () => {
    expect(() => isRequired('myField')).toThrow(Error);
  });
});
