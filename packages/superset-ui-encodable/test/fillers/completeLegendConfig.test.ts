import completeLegendConfig from '../../src/fillers/completeLegendConfig';

describe('completeLegendConfig()', () => {
  it('returns input legend config if legend is defined', () => {
    expect(
      completeLegendConfig({
        type: 'quantitative',
        field: 'consumption',
        legend: { a: 1 },
      }),
    ).toEqual({ a: 1 });
  });
  it('returns default legend config if legend is undefined', () => {
    expect(
      completeLegendConfig({
        type: 'quantitative',
        field: 'consumption',
      }),
    ).toEqual({});
  });
  it('returns false if legend is false', () => {
    expect(
      completeLegendConfig({
        type: 'quantitative',
        field: 'consumption',
        legend: false,
      }),
    ).toEqual(false);
  });
});
