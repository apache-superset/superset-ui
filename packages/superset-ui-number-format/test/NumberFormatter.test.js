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
      it('requires field config.name', () => {
        expect(() => new NumberFormatter({})).toThrow();
      });
      it('if formatFn field is specified, use that as format function', () => {
        const formatter = new NumberFormatter({
          formatFn: () => 'haha',
          name: 'haha-formatter',
        });
        expect(formatter.format(12345)).toEqual('haha');
      });
      it('otherwise, use d3.format(config.name) as format function', () => {
        const formatter = new NumberFormatter({ name: ',.4f' });
        expect(formatter.format(12345.67)).toEqual('12,345.6700');
      });
      it('if it is an invalid d3 format, the format function displays error message', () => {
        const formatter = new NumberFormatter({ name: 'i-am-groot' });
        expect(formatter.format(12345.67)).toEqual('Invalid format: i-am-groot');
      });
    });
  });
  describe('.format(value)', () => {
    it('returns formatted value', () => {
      const formatter = new NumberFormatter({ name: ',.4%' });
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
