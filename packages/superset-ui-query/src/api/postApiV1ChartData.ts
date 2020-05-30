import { SupersetClientInterface, SupersetClient, RequestConfig } from '@superset-ui/connection';
import { QueryContext } from '../types/Query';

export interface PostApiV1ChartDataParams {
  client?: SupersetClientInterface;
  requestConfig?: RequestConfig;
  queryContext: QueryContext;
}

export interface PostApiV1ChartDataResponse {
  result: QueryResponse[];
}

export default function postApiV1ChartData({
  client = SupersetClient,
  requestConfig,
  queryContext,
}: PostApiV1ChartDataParams) {
  return client
    .post({
      ...requestConfig,
      endpoint: '/api/v1/chart/data',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(queryContext),
    } as RequestConfig)
    .then(({ json }) => json as PostApiV1ChartDataResponse);
}
