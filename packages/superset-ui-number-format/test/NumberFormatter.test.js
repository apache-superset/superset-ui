import NumberFormatter from '../src/NumberFormatter';

describe('NumberFormatter', () => {
  describe('new NumberFormatter(config)', () => {
    it('requires config.id', () => {
      expect(() => new NumberFormatter()).toThrow();
    });
    it('requires config.formatFunc', () => {
      expect(
        () =>
          new NumberFormatter({
            id: 'my_format',
          }),
      ).toThrow();
    });
  });
});
