import parseWidthOrHeight from '../../src/components/parseWidthOrHeight';

describe('parseWidthOrHeight(input)', () => {
  it('handles string "auto"', () => {
    expect(parseWidthOrHeight('auto')).toEqual({ isDynamic: true, multiplier: 1 });
  });

  it('handles strings with % at the end', () => {
    expect(parseWidthOrHeight('100%')).toEqual({ isDynamic: true, multiplier: 1 });
    expect(parseWidthOrHeight('50%')).toEqual({ isDynamic: true, multiplier: 0.5 });
    expect(parseWidthOrHeight('0%')).toEqual({ isDynamic: true, multiplier: 0 });
  });

  it('handles strings that are numbers', () => {
    expect(parseWidthOrHeight('100')).toEqual({ isDynamic: false, value: 100 });
    expect(parseWidthOrHeight('20')).toEqual({ isDynamic: false, value: 20 });
  });

  it('handles numbers', () => {
    expect(parseWidthOrHeight(100)).toEqual({ isDynamic: false, value: 100 });
    expect(parseWidthOrHeight(0)).toEqual({ isDynamic: false, value: 0 });
  });
});
