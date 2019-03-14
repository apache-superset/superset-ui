import 'whatwg-fetch';
import { CallApi } from '../types';

const cacheAvailable = 'caches' in self;
const NOT_MODIFIED = 304;
const OK = 200;

// This function fetches an API response and returns the corresponding json
export default function callApi({
  body,
  cache = 'default',
  credentials = 'same-origin',
  headers,
  method = 'GET',
  mode = 'same-origin',
  postPayload,
  redirect = 'follow',
  signal,
  stringify = true,
  url,
}: CallApi): Promise<Response> {
  const request = {
    body,
    cache,
    credentials,
    headers,
    method,
    mode,
    redirect,
    signal,
  };

  if (method === 'GET' && cacheAvailable) {
    return caches.open('superset').then(supersetCache =>
      supersetCache
        .match(url)
        .then(cachedResponse => {
          if (cachedResponse) {
            // if we have a cached response, send its ETag in the
            // `If-None-Match` header in a conditional request
            const etag = cachedResponse.headers.get('Etag');
            if (etag) {
              request.headers = request.headers || {};
              request.headers['If-None-Match'] = etag;
            }
          }

          return fetch(url, request); // eslint-disable-line compat/compat
        })
        .then(response => {
          if (response.status === NOT_MODIFIED) {
            return supersetCache.match(url).then(cachedResponse => {
              if (cachedResponse) {
                return cachedResponse.clone();
              }
              throw new Error('Received 304 but no content is cached!');
            });
          } else if (response.status === OK && response.headers.get('Etag')) {
            supersetCache.delete(url);
            supersetCache.put(url, response.clone());
          }

          return response;
        }),
    );
  }

  if (
    (method === 'POST' || method === 'PATCH' || method === 'PUT') &&
    typeof postPayload === 'object'
  ) {
    // using FormData has the effect that Content-Type header is set to `multipart/form-data`,
    // not e.g., 'application/x-www-form-urlencoded'
    const formData: FormData = new FormData();

    Object.keys(postPayload).forEach(key => {
      const value = postPayload[key];
      if (typeof value !== 'undefined') {
        formData.append(key, stringify ? JSON.stringify(value) : value);
      }
    });

    request.body = formData;
  }

  return fetch(url, request); // eslint-disable-line compat/compat
}
