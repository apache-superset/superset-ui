import 'babel-polyfill';
import { ChartProps } from '@superset-ui/chart';
import transformProps from '../../src/transformProps';

describe('Observable transform props', () => {
  const formData = {
    dataInjectionCell: 'hello',
    displayCells: ['hello', 'test', 'hello'],
    showDebug: true,
    observableUrl: 'test@test.com',
  };
  const chartProps = new ChartProps({
    formData,
    width: 200,
    height: 200,
    queryData: {
      data: [{ name: 'Hulk', sum__num: 1 }],
    },
  });
  it('should transform chartprops for Observable', () => {
    expect(transformProps(chartProps)).toEqual({
      data: [{ name: 'Hulk', sum__num: 1 }],
      height: 200,
      observableUrl: 'test@test.com',
      displayedCells: [],
      dataInjectionCell: 'hello',
      showDebug: true,
      width: 200,
    });
  });
});
