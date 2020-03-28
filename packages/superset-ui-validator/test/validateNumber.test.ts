import { validateNumber } from '../src';

describe('validateNumber()', () => {
  it('returns the warning message if invalid', () => {
    expect(validateNumber(undefined)).toBeTruthy();
    expect(validateNumber(null)).toBeTruthy();
    expect(validateNumber('')).toBeTruthy();
  });
  it('returns false if the input is valid', () => {
    expect(validateNumber(0)).toBeFalsy();
    expect(validateNumber(10.1)).toBeFalsy();
    expect(validateNumber(10)).toBeFalsy();
    expect(validateNumber('10')).toBeFalsy();
  });
});
