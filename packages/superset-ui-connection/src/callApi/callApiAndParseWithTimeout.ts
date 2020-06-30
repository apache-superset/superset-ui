import callApi from './callApi';
import rejectAfterTimeout from './rejectAfterTimeout';
import parseResponse from './parseResponse';
import { CallApi, ClientTimeout, ParseMethod } from '../types';

export default function callApiAndParseWithTimeout<T extends ParseMethod = 'json'>({
  timeout,
  parseMethod,
  ...rest
}: { timeout?: ClientTimeout; parseMethod?: T } & CallApi) {
  const apiPromise = callApi(rest);

  const racedPromise =
    typeof timeout === 'number' && timeout > 0
      ? Promise.race([rejectAfterTimeout<Response>(timeout), apiPromise])
      : apiPromise;

  return parseResponse(racedPromise, (parseMethod || 'json') as T);
}
