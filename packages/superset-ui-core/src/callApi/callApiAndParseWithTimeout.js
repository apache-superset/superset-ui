import callApi from './callApi';
import rejectAfterTimeout from './rejectAfterTimeout';
import parseResponse from './parseResponse';

export default function callApiAndParseWithTimeout({ timeout, ...rest }) {
  const apiPromise = callApi(rest);

  const racedPromise =
    typeof timeout === 'number'
      ? Promise.race([rejectAfterTimeout(timeout), apiPromise])
      : apiPromise;

  return parseResponse(racedPromise);
}
