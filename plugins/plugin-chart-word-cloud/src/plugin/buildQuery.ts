import { buildQueryContext } from '@superset-ui/query';
import { WordCloudFormData } from '../types';

export default function buildQuery(formData: WordCloudFormData) {
  // Set the single QueryObject's groupby field with series in formData
  console.log('!', formData);
  return buildQueryContext(formData, baseQueryObject => {
    console.log('!', formData, baseQueryObject);
    return [
      {
        ...baseQueryObject,
      },
    ];
  });
}
