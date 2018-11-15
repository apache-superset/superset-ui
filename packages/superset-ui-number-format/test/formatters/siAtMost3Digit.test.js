import NumberFormatter from '../../src/NumberFormatter';
import formatter from '../../src/formatters/siAtMost3Digit';

describe('Formatter: si_at_most_3_digit', () => {
  it('is an instance of NumberFormat', () => {
    expect(formatter).toBeInstanceOf(NumberFormatter);
  });
  it('formats the given value', () => {
    expect(formatter(10)).toBe('10');
    expect(formatter(1)).toBe('1');
    expect(formatter(1.0)).toBe('1');
    expect(formatter(10.0)).toBe('10');
    expect(formatter(10001)).toBe('10.0k');
    expect(formatter(10100)).toBe('10.1k');
    expect(formatter(111000000)).toBe('111M');
    expect(formatter(0.23)).toBe('230m');

    expect(formatter(-10)).toBe('-10');
    expect(formatter(-1)).toBe('-1');
    expect(formatter(-1.0)).toBe('-1');
    expect(formatter(-10.0)).toBe('-10');
    expect(formatter(-10001)).toBe('-10.0k');
    expect(formatter(-10101)).toBe('-10.1k');
    expect(formatter(-111000000)).toBe('-111M');
    expect(formatter(-0.23)).toBe('-230m');
  });
});
