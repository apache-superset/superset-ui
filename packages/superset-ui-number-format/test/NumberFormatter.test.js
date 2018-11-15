import NumberFormatter from '../src/NumberFormatter';

describe('NumberFormatter', () => {
  it('exists', () => {
    expect(NumberFormatter).toBeDefined();
  });
  describe('new NumberFormatter(configOrFormatString)', () => {
    it('requires configOrFormatString', () => {
      expect(() => new NumberFormatter()).toThrow();
    });
    describe('if configOrFormatString is string', () => {
      it('uses the input as d3.format string', () => {
        const formatter = new NumberFormatter('.2f');
        expect(formatter.format(100)).toEqual('100.00');
      });
    });
    describe('if configOrFormatString is not string', () => {
      it('requires field config.formatName', () => {
        expect(() => new NumberFormatter({})).toThrow();
      });
      it('if formatFunc field is specified, use that as format function', () => {
        const formatter = new NumberFormatter({
          formatFunc: () => 'haha',
          formatName: 'haha-formatter',
        });
        expect(formatter.format(12345)).toEqual('haha');
      });
      it('otherwise, use d3.format(config.formatName) as format function', () => {
        const formatter = new NumberFormatter({ formatName: ',.4f' });
        expect(formatter.format(12345.67)).toEqual('12,345.6700');
      });
      it('if it is an invalid d3 format, the format function displays error message', () => {
        const formatter = new NumberFormatter({ formatName: 'i-am-groot' });
        expect(formatter.format(12345.67)).toEqual('Invalid format: i-am-groot');
      });
    });
  });
  describe('formatter is also a format function itself', () => {
    it('returns formatted value', () => {
      const formatter = new NumberFormatter({ formatName: ',.4%' });
      expect(formatter(12345.67)).toEqual('1,234,567.0000%');
    });
    it('formatter(value) is the same with formatter.format(value)', () => {
      const formatter = new NumberFormatter({ formatName: ',.4%' });
      const value = 12345.67;
      expect(formatter(value)).toEqual(formatter.format(value));
    });
  });
  describe('.format(value)', () => {
    const formatter = new NumberFormatter({ formatName: ',.4%' });
    it('handles null', () => {
      expect(formatter.format(null)).toBeNull();
    });
    it('handles undefined', () => {
      expect(formatter.format(undefined)).toBeUndefined();
    });
    it('handles NaN', () => {
      expect(formatter.format(NaN)).toBeNaN();
    });
    it('handles positive and negative infinity', () => {
      expect(formatter.format(Number.POSITIVE_INFINITY)).toEqual('∞');
      expect(formatter.format(Number.NEGATIVE_INFINITY)).toEqual('-∞');
    });
    it('otherwise returns formatted value', () => {
      expect(formatter.format(12345.67)).toEqual('1,234,567.0000%');
    });
  });
  describe('.preview(value)', () => {
    const formatter = new NumberFormatter('.2f');
    it('returns string comparing value before and after formatting', () => {
      expect(formatter.preview(100)).toEqual('100 => 100.00');
    });
    it('uses the default preview value if not specified', () => {
      expect(formatter.preview()).toEqual('12345.432 => 12345.43');
    });
  });
});
