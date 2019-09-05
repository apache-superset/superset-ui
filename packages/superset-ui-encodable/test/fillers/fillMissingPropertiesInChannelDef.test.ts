import fillMissingPropertiesInChannelDef from '../../src/fillers/fillMissingPropertiesInChannelDef';

const DEFAULT_OUTPUT = {
  type: 'quantitative',
  field: 'speed',
  title: 'speed',
  axis: {
    format: undefined,
    labelAngle: 0,
    labelFlush: true,
    labelOverlap: {
      strategy: 'rotate',
      labelAngle: 40,
    },
    labelPadding: 4,
    orient: 'bottom',
    tickCount: 5,
    ticks: true,
    title: 'speed',
    titlePadding: 4,
  },
  scale: { type: 'linear', nice: true, clamp: true, zero: true },
};

describe('fillMissingPropertiesInChannelDef(channelType, channelDef)', () => {
  it('fills the missing fields', () => {
    expect(
      fillMissingPropertiesInChannelDef('X', {
        type: 'quantitative',
        field: 'speed',
      }),
    ).toEqual(DEFAULT_OUTPUT);
  });
  it('uses title if specified', () => {
    expect(
      fillMissingPropertiesInChannelDef('X', {
        type: 'quantitative',
        field: 'speed',
        title: 'How fast is it?',
      }),
    ).toEqual({
      ...DEFAULT_OUTPUT,
      title: 'How fast is it?',
      axis: { ...DEFAULT_OUTPUT.axis, title: 'How fast is it?' },
    });
  });
  it('leaves the title blank for ValueDef', () => {
    expect(
      fillMissingPropertiesInChannelDef('X', {
        value: 1,
      }),
    ).toEqual({ axis: false, scale: false, title: '', value: 1 });
  });
});
