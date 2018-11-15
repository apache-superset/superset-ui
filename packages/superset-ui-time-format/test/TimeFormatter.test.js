import TimeFormatter, { PREVIEW_TIME } from '../src/TimeFormatter';

describe('TimeFormatter', () => {
  describe('new TimeFormatter(config)', () => {
    it('requires config.id', () => {
      expect(() => new TimeFormatter()).toThrow();
    });
    it('requires config.formatFunc', () => {
      expect(
        () =>
          new TimeFormatter({
            id: 'my_format',
          }),
      ).toThrow();
    });
  });
  describe('formatter is also a format function itself', () => {
    const formatter = new TimeFormatter({
      id: 'year_only',
      formatFunc: value => `${value.getFullYear()}`,
    });
    it('returns formatted value', () => {
      expect(formatter(PREVIEW_TIME)).toEqual('2017');
    });
    it('formatter(value) is the same with formatter.format(value)', () => {
      const value = PREVIEW_TIME;
      expect(formatter(value)).toEqual(formatter.format(value));
    });
  });
  describe('.format(value)', () => {
    const formatter = new TimeFormatter({
      id: 'year_only',
      formatFunc: value => `${value.getFullYear()}`,
    });
    it('returns formatted value', () => {
      expect(formatter.format(PREVIEW_TIME)).toEqual('2017');
    });
  });
  describe('.preview(value)', () => {
    const formatter = new TimeFormatter({
      id: 'year_only',
      formatFunc: value => `${value.getFullYear()}`,
    });
    it('returns string comparing value before and after formatting', () => {
      expect(formatter.preview(PREVIEW_TIME)).toEqual('Tue, 14 Feb 2017 11:22:33 GMT => 2017');
    });
    it('uses the default preview value if not specified', () => {
      expect(formatter.preview()).toEqual('Tue, 14 Feb 2017 11:22:33 GMT => 2017');
    });
  });
});
