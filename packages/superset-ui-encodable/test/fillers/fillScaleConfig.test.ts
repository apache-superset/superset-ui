import fillScaleConfig from '../../src/fillers/fillScaleConfig';

describe('fillScaleConfig(channelDef)', () => {
  it('returns scale config with type', () => {
    expect(fillScaleConfig({ type: 'quantitative', field: 'consumption' }, 'X')).toEqual({
      type: 'linear',
      nice: true,
      clamp: true,
      zero: true,
    });
  });
  describe('default settings', () => {
    describe('nice', () => {
      it('set if not specified', () => {
        expect(fillScaleConfig({ type: 'quantitative', field: 'consumption' }, 'X')).toEqual({
          type: 'linear',
          nice: true,
          clamp: true,
          zero: true,
        });
      });
      it('does not apply if incompatible', () => {
        expect(
          fillScaleConfig(
            { type: 'nominal', field: 'brand', scale: { type: 'point' } },
            'Category',
          ),
        ).toEqual({
          type: 'point',
        });
      });
      it('does not change if already specified', () => {
        expect(
          fillScaleConfig(
            { type: 'quantitative', field: 'consumption', scale: { nice: false } },
            'X',
          ),
        ).toEqual({
          type: 'linear',
          nice: false,
          clamp: true,
          zero: true,
        });
      });
    });
    describe('clamp', () => {
      it('set if not specified', () => {
        expect(fillScaleConfig({ type: 'quantitative', field: 'consumption' }, 'X')).toEqual({
          type: 'linear',
          nice: true,
          clamp: true,
          zero: true,
        });
      });
      it('does not change if already specified', () => {
        expect(
          fillScaleConfig(
            { type: 'quantitative', field: 'consumption', scale: { clamp: false } },
            'X',
          ),
        ).toEqual({
          type: 'linear',
          nice: true,
          clamp: false,
          zero: true,
        });
      });
    });
    describe('zero', () => {
      it('set if not specified', () => {
        expect(fillScaleConfig({ type: 'quantitative', field: 'consumption' }, 'X')).toEqual({
          type: 'linear',
          nice: true,
          clamp: true,
          zero: true,
        });
      });
      it('does not apply if incompatible', () => {
        expect(
          fillScaleConfig(
            { type: 'quantitative', field: 'consumption', scale: { type: 'log' } },
            'X',
          ),
        ).toEqual({
          type: 'log',
          nice: true,
          clamp: true,
        });
      });
      it('does not change if already specified', () => {
        expect(
          fillScaleConfig(
            { type: 'quantitative', field: 'consumption', scale: { zero: false } },
            'X',
          ),
        ).toEqual({
          type: 'linear',
          nice: true,
          clamp: true,
          zero: false,
        });
      });
    });
  });

  it('returns false if scale is null', () => {
    expect(
      fillScaleConfig({ type: 'quantitative', field: 'consumption', scale: null }, 'X'),
    ).toEqual(false);
  });
  it('returns false if cannot infer scale type', () => {
    expect(fillScaleConfig({ type: 'geojson', field: 'lat' }, 'X')).toEqual(false);
  });
});
