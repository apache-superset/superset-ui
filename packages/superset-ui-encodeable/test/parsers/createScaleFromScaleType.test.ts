import createScaleFromScaleType from '../../src/parsers/createScaleFromScaleType';

describe('createScaleFromScaleType(type)', () => {
  it('creates linear scale', () => {
    const scale = createScaleFromScaleType<number>('linear');
    scale.domain([0, 10]);
    scale.range([0, 100]);
    expect(scale(10)).toEqual(100);
  });
  it('creates log scale', () => {
    const scale = createScaleFromScaleType<number>('log');
    scale.domain([1, 100]);
    scale.range([1, 10]);
    expect(scale(10)).toEqual(5.5);
    expect(scale(100)).toEqual(10);
  });
  it('creates power scale', () => {
    const scale = createScaleFromScaleType<number>('pow');
    scale.domain([0, 100]);
    scale.range([1, 10]);
    expect(scale(10)).toEqual(5.5);
    expect(scale(100)).toEqual(10);
  });
});
