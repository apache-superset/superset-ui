import fillMissingPropertiesInChannelDef from '../../src/fillers/fillMissingPropertiesInChannelDef';

const DEFAULT_OUTPUT = {
  type: 'quantitative',
  field: 'speed',
  title: 'speed',
  axis: {
    format: undefined,
    labelAngle: 40,
    labelFlush: true,
    labelOverlap: 'auto',
    labelPadding: 4,
    orient: 'bottom',
    tickCount: 5,
    ticks: true,
    title: 'speed',
    titlePadding: 4,
  },
  scale: { type: 'linear', nice: true, clamp: true, zero: true },
};

describe('fillMissingPropertiesInChannelDef', () => {
  it('fills the missing fields', () => {
    expect(
      fillMissingPropertiesInChannelDef(
        {
          type: 'quantitative',
          field: 'speed',
        },
        'X',
      ),
    ).toEqual(DEFAULT_OUTPUT);
  });
  it('uses title if specified', () => {
    expect(
      fillMissingPropertiesInChannelDef(
        {
          type: 'quantitative',
          field: 'speed',
          title: 'How fast is it?',
        },
        'X',
      ),
    ).toEqual({
      ...DEFAULT_OUTPUT,
      title: 'How fast is it?',
      axis: { ...DEFAULT_OUTPUT.axis, title: 'How fast is it?' },
    });
  });
  it('leaves the title blank for ValueDef', () => {
    expect(
      fillMissingPropertiesInChannelDef(
        {
          value: 1,
        },
        'X',
      ),
    ).toEqual({ axis: false, scale: false, title: '', value: 1 });
  });
});
