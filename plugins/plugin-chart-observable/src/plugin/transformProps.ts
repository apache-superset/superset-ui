import { ChartProps } from '@superset-ui/chart';
import { ObservableProps } from '../chart/Observable';
import { ObservableFormData } from '../types';

export default function transformProps(chartProps: ChartProps): ObservableProps {
  const { width, height, formData, queryData } = chartProps;
  const { observableUrl, displayedCells, showDebug } = formData as ObservableFormData;

  // console.warn('formData!!!!!!!!!!!', formData);

  return {
    data: queryData.data,
    height,
    observableUrl: observableUrl || 'nada',
    displayedCells: [],
    showDebug: showDebug || false,
    width,
  };
}
