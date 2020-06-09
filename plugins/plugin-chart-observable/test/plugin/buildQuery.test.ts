import 'babel-polyfill';
import buildQuery from '../../src/buildQuery';

describe('Observable buildQuery', () => {
  const formData = {
    datasource: '5__table',
    granularity_sqla: 'ds',
    series: 'foo',
    displayedCells: ['a', 'b'],
    dataInjectionCell: 'cell',
    observableUrl: 'https://abc.qwerty.com',
    showDebug: true,
    viz_type: 'observable',
    queryFields: { series: 'groupby' },
  };

  it('should build groupby with series in form data', () => {
    const queryContext = buildQuery(formData);
    const [query] = queryContext.queries;
    expect(query.groupby).toEqual(['foo']);
  });
});
