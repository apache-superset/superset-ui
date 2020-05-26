import { ChartProps } from '@superset-ui/chart';
import { WordCloudProps } from '@superset-ui/plugin-chart-word-cloud/src/chart/WordCloud';
import { WordCloudFormData } from '@superset-ui/plugin-chart-word-cloud/src/types';

export default function transformProps(chartProps: ChartProps): WordCloudProps {
  const { width, height, formData, queryData } = chartProps;
  const { encoding, rotation } = formData as WordCloudFormData;

  return {
    data: queryData.data,
    encoding,
    height,
    rotation,
    width,
  };
}
