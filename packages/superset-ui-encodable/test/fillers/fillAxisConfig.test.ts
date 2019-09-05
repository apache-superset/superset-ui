import fillAxisConfig from '../../src/fillers/fillAxisConfig';

const DEFAULT_CONFIG = {
  format: undefined,
  labelAngle: 40,
  labelFlush: true,
  labelOverlap: 'auto',
  labelPadding: 4,
  orient: 'bottom',
  tickCount: 5,
  ticks: true,
  title: 'Protector of the realm',
  titlePadding: 4,
};

describe('fillAxisConfig(channelDef)', () => {
  it('returns axis config with type', () => {
    expect(
      fillAxisConfig(
        { type: 'quantitative', field: 'consumption', title: 'Protector of the realm' },
        'X',
      ),
    ).toEqual(DEFAULT_CONFIG);
  });
  describe('default settings', () => {
    describe('format and title', () => {
      it('inherit from channel if not specified', () => {
        expect(
          fillAxisConfig(
            {
              type: 'quantitative',
              field: 'consumption',
              format: '.2f',
              title: 'King in the North',
            },
            'X',
          ),
        ).toEqual({
          ...DEFAULT_CONFIG,
          format: '.2f',
          title: 'King in the North',
        });
      });
      it('does not change if already specified', () => {
        expect(
          fillAxisConfig(
            {
              type: 'quantitative',
              field: 'consumption',
              format: '.2f',
              title: 'King in the North',
              axis: { format: '.3f', title: 'Mother of Dragons' },
            },
            'X',
          ),
        ).toEqual({
          ...DEFAULT_CONFIG,
          format: '.3f',
          title: 'Mother of Dragons',
        });
      });
    });
    describe('labelAngle and orient', () => {
      it('uses default for X', () => {
        expect(
          fillAxisConfig(
            { type: 'quantitative', field: 'consumption', title: 'Protector of the realm' },
            'X',
          ),
        ).toEqual(DEFAULT_CONFIG);
      });
      it('uses default for Y', () => {
        expect(
          fillAxisConfig(
            { type: 'quantitative', field: 'consumption', title: 'Protector of the realm' },
            'YBand',
          ),
        ).toEqual({
          ...DEFAULT_CONFIG,
          labelAngle: 0,
          orient: 'left',
        });
      });
      it('does not change if already specified', () => {
        expect(
          fillAxisConfig(
            {
              type: 'quantitative',
              field: 'consumption',
              title: 'Protector of the realm',
              axis: { labelAngle: 30, orient: 'top' },
            },
            'X',
          ),
        ).toEqual({
          ...DEFAULT_CONFIG,
          labelAngle: 30,
          orient: 'top',
        });
      });
    });
    describe('others', () => {
      it('does not change if already specified', () => {
        expect(
          fillAxisConfig(
            {
              type: 'quantitative',
              field: 'consumption',
              title: 'Protector of the realm',
              axis: {
                labelFlush: false,
                labelOverlap: 'flat',
                labelPadding: 10,
                tickCount: 20,
                ticks: false,
                titlePadding: 10,
              },
            },
            'X',
          ),
        ).toEqual({
          ...DEFAULT_CONFIG,
          labelFlush: false,
          labelOverlap: 'flat',
          labelPadding: 10,
          tickCount: 20,
          ticks: false,
          titlePadding: 10,
        });
      });
    });
  });

  it('returns false if not XY channel', () => {
    expect(
      fillAxisConfig(
        { type: 'quantitative', field: 'consumption', title: 'Protector of the realm' },
        'Color',
      ),
    ).toEqual(false);
  });
  it('returns false if axis is null', () => {
    expect(
      fillAxisConfig(
        { type: 'quantitative', field: 'consumption', title: 'Protector of the realm', axis: null },
        'X',
      ),
    ).toEqual(false);
  });
  it('returns false if axis is false', () => {
    expect(
      fillAxisConfig(
        {
          type: 'quantitative',
          field: 'consumption',
          title: 'Protector of the realm',
          axis: false,
        },
        'X',
      ),
    ).toEqual(false);
  });
});
