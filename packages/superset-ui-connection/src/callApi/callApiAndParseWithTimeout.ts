import callApi from './callApi';
import rejectAfterTimeout from './rejectAfterTimeout';
import parseResponse from './parseResponse';
import { CallApi, ClientTimeout, ParseMethod } from '../types';

export default function callApiAndParseWithTimeout<T extends ParseMethod = 'json'>({
  timeout,
  parseMethod = 'json',
  ...rest
}: { timeout?: ClientTimeout; parseMethod?: ParseMethod } & CallApi) {
  const apiPromise = callApi(rest);

  const racedPromise =
    typeof timeout === 'number' && timeout > 0
      ? Promise.race([rejectAfterTimeout<Response>(timeout), apiPromise])
      : apiPromise;

  return parseResponse<T>(racedPromise, parseMethod);
}
