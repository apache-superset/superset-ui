import { SupersetClient, RequestConfig } from '@superset-ui/connection';
import { QueryFormData } from '../../types/QueryFormData';
import { LegacyChartDataResponse } from './types';
import { BaseParams } from '../types';

export interface Params extends BaseParams {
  method?: 'GET' | 'POST';
  url?: string;
  formData: QueryFormData;
}

interface TransformParams {
  url: string;
  formData: QueryFormData;
}

function transformFormDataGetRequest({ formData, url }: TransformParams) {
  /** placeholderUrl is used so that we can make use of the URL constructor
   * and searchParams */

  let placeholderUrl = 'http://localhost:3000';

  if (url.charAt(0) !== '/') {
    placeholderUrl += '/';
  }

  const tempUrl = new URL(`${placeholderUrl}${url}`);
  tempUrl.searchParams.append('form_data', JSON.stringify(formData));
  return tempUrl.toString().replace(placeholderUrl, '');
}

export default function fetchExploreJson({
  client = SupersetClient,
  method = 'POST',
  requestConfig,
  url = '/superset/explore_json/',
  formData,
}: Params) {
  const fetchFunc = method === 'GET' ? client.get : client.post;
  return fetchFunc({
    ...requestConfig,
    url: method === 'GET' ? transformFormDataGetRequest({ formData, url }) : url,
    postPayload: { form_data: formData },
  } as RequestConfig).then(({ json }) => json as LegacyChartDataResponse);
}
