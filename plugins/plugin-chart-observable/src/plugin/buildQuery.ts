import { buildQueryContext } from '@superset-ui/query';
import { ObservableFormData } from '../types';

export default function buildQuery(formData: ObservableFormData) {
  // Set the single QueryObject's groupby field with series in formData
  return buildQueryContext(formData, baseQueryObject => [
    {
      ...baseQueryObject,
    },
  ]);
}
