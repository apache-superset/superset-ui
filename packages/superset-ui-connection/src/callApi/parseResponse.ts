import { ParseMethod, SupersetClientResponse, TextResponse, JsonResponse } from '../types';

export default function parseResponse<T extends ParseMethod = 'json'>(
  apiPromise: Promise<Response>,
  parseMethod?: T,
) {
  type ReturnType = Promise<
    T extends 'text'
      ? TextResponse
      : T extends 'json'
      ? JsonResponse
      : T extends 'raw' | null
      ? Response
      : SupersetClientResponse
  >;
  const promise = apiPromise.then(response => {
    // reject failed HTTP requests with the raw response
    if (!response.ok) return Promise.reject(response);
    return response;
  });

  if (parseMethod === null || parseMethod === 'raw') {
    return promise as ReturnType;
  }
  if (parseMethod === 'text') {
    return promise.then(response =>
      response.text().then(text => ({ response, text })),
    ) as ReturnType;
  }
  // by default treat this as json
  if (parseMethod === undefined || parseMethod === 'json') {
    return promise.then(response =>
      response.json().then(json => ({ json, response })),
    ) as ReturnType;
  }

  throw new Error(`Expected parseResponse=json|text|raw|null, got '${parseMethod}'.`);
}
