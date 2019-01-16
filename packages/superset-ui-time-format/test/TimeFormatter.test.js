import TimeFormatter from '../src/TimeFormatter';

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
});
