import { ChartProps } from '@superset-ui/chart';
import { ObservableProps } from '../chart/Observable';
import { ObservableFormData } from '../types';

export default function transformProps(chartProps: ChartProps): ObservableProps {
  const { width, height, formData, queryData } = chartProps;
  const { rotation } = formData as ObservableFormData;

  return {
    data: queryData.data,
    height,
    rotation,
    width,
  };
}
