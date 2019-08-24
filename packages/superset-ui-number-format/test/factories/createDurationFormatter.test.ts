import NumberFormatter from '../../src/NumberFormatter';
import createDurationFormatter from '../../src/factories/createDurationFormatter';

describe('createDurationFormatter()', () => {
  it('creates an instance of NumberFormatter', () => {
    const formatter = createDurationFormatter();
    const formatterMs = createDurationFormatter({ multiplier: 1 });
    const formatterS = createDurationFormatter({ multiplier: 1000 });
    expect(formatter).toBeInstanceOf(NumberFormatter);
    expect(formatterMs).toBeInstanceOf(NumberFormatter);
    expect(formatterS).toBeInstanceOf(NumberFormatter);
  });
  it('format milliseconds in human readable format', () => {
    const formatter = createDurationFormatter();
    expect(formatter(0)).toBe('0ms');
    expect(formatter(1000)).toBe('1s');
    expect(formatter(1337)).toBe('1.3s');
    expect(formatter(60 * 1000)).toBe('1m');
    expect(formatter(90 * 1000)).toBe('1m 30s');
  });
  it('format seconds in human readable format', () => {
    const formatter = createDurationFormatter({ multiplier: 1000 });
    expect(formatter(0.5)).toBe('500ms');
    expect(formatter(1)).toBe('1s');
    expect(formatter(30)).toBe('30s');
    expect(formatter(60)).toBe('1m');
    expect(formatter(90)).toBe('1m 30s');
  });
});
