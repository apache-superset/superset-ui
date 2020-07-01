import { SupersetClient, Method, Url } from '@superset-ui/connection';
import { QueryFormData } from '../../types/QueryFormData';
import { LegacyChartDataResponse } from './types';
import { BaseParams } from '../types';

export interface Params extends BaseParams {
  method?: Method;
  url?: Url;
  formData: QueryFormData;
}

export default async function fetchExploreJson({
  client = SupersetClient,
  method = 'POST',
  requestConfig,
  url = '/superset/explore_json/',
  formData,
}: Params) {
  const { json } = await client.request({
    ...requestConfig,
    method,
    url,
    // TODO: Have to transform formData as query string for GET
    postPayload: { form_data: formData },
  });
  return json as LegacyChartDataResponse;
}
