import getNumberFormatterRegistry, {
  getFormatter,
  formatNumber,
} from '../src/NumberFormatterRegistrySingleton';
import NumberFormatterRegistry from '../src/NumberFormatterRegistry';

describe('NumberFormatterRegistrySingleton', () => {
  describe('getNumberFormatterRegistry()', () => {
    it('returns a NumberFormatterRegisry', () => {
      expect(getNumberFormatterRegistry()).toBeInstanceOf(NumberFormatterRegistry);
    });
  });
  describe('getFormatter(format)', () => {
    it('returns a format function', () => {
      const format = getFormatter('.3s');
      expect(format).toBeInstanceOf(Function);
      expect(format(12345)).toEqual('12.3k');
    });
    it('returns a format function even given invalid format', () => {
      const format = getFormatter('xkcd');
      expect(format).toBeInstanceOf(Function);
      expect(format(12345)).toEqual('Invalid format: xkcd');
    });
  });
  describe('formatNumber(format, value)', () => {
    it('format the given number using the specified format', () => {
      const output = formatNumber('.3s', 12345);
      expect(output).toEqual('12.3k');
    });
  });
});
