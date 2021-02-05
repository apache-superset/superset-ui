import { buildQueryContext } from '@superset-ui/core';
import { WordCloudFormData } from '../types';

export default function buildQuery(formData: WordCloudFormData) {
  // Set the single QueryObject's groupby field with series in formData
  const { metric } = formData;
  return buildQueryContext(formData, baseQueryObject => [
    {
      ...baseQueryObject,
      orderby: [[metric, false]],
    },
  ]);
}
