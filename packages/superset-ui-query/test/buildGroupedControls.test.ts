import buildGroupedControls from '../src/buildGroupedControls';

describe('buildGroupedControls', () => {
  it('should return default object', () => {
    expect(buildGroupedControls({})).toEqual({
      columns: [],
      groupby: [],
      metrics: [],
    });
  });

  it('should group default metric controls to metrics', () => {
    expect(buildGroupedControls({ metric: 'my_metric' }).metrics).toEqual(['my_metric']);
  });

  it('should group custom metrics with default metrics', () => {
    expect(
      buildGroupedControls(
        { metric: 'metric_1', my_custom_metric: 'metric_2' },
        { my_custom_metric: 'metrics' },
      ).metrics,
    ).toEqual(['metric_1', 'metric_2']);
  });

  it('should extract columns', () => {
    expect(buildGroupedControls({ columns: 'col_1' })).toEqual({
      columns: ['col_1'],
      groupby: [],
      metrics: [],
    });
  });

  it('should extract groupby', () => {
    expect(buildGroupedControls({ groupby: 'col_1' })).toEqual({
      columns: [],
      groupby: ['col_1'],
      metrics: [],
    });
  });

  it('should extract custom groupby', () => {
    expect(
      buildGroupedControls({ series: 'col_1', metric: 'metric_1' }, { series: 'groupby' }),
    ).toEqual({
      columns: [],
      groupby: ['col_1'],
      metrics: ['metric_1'],
    });
  });

  it('should merge custom groupby with default group', () => {
    expect(
      buildGroupedControls(
        { groupby: 'col_1', series: 'col_2', metric: 'metric_1' },
        { series: 'groupby' },
      ),
    ).toEqual({
      columns: [],
      groupby: ['col_1', 'col_2'],
      metrics: ['metric_1'],
    });
  });
});
