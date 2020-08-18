import 'babel-polyfill';
import { ChartProps } from '@superset-ui/chart';
import transformProps from '../../src/Timeseries/transformProps';

describe('EchartsTimeseries tranformProps', () => {
  const formData = {
    colorScheme: 'bnbColors',
    datasource: '3__table',
    granularity_sqla: 'ds',
    metric: 'sum__num',
    series: 'name',
  };
  const chartProps = new ChartProps({
    formData,
    width: 800,
    height: 600,
    queryData: {
      data: [{ sum__num: 1, __timestamp: 599616000000 }],
    },
  });

  it('should tranform chart props for viz', () => {
    expect(transformProps(chartProps)).toEqual(
      expect.objectContaining({
        width: 800,
        height: 600,
        data: [{ sum__num: 1, __timestamp: new Date(599616000000) }],
      }),
    );
  });
});
