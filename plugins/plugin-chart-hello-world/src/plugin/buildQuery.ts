import { buildQueryContext } from '@superset-ui/query';
import { HelloWorldFormData } from '../types';

export default function buildQuery(formData: HelloWorldFormData) {
  // TODO: explain what buildQuery is, baseQueryObject
  return buildQueryContext(formData, baseQueryObject => [
    {
      ...baseQueryObject,
    },
  ]);
}
