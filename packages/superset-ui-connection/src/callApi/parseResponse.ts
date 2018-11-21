const PARSERS = {
  json: (response: Response): Promise<JsonResponse | any> =>
    response.json().then(json => ({ json, response })),
  text: (response: Response): Promise<TextResponse | any> =>
    response.text().then(text => ({ response, text })),
};

export default function parseResponse(
  apiPromise: Promise<Response>,
  parseMethod: parseMethod = 'json',
): Promise<Response | JsonResponse | TextResponse> {
  if (parseMethod === null) return apiPromise;

  const responseParser = PARSERS[parseMethod] || PARSERS.json;

  return apiPromise
    .then(
      (response: Response): Promise<Response> => {
        if (!response.ok) {
          return Promise.reject(response);
        }

        return Promise.resolve(response);
      },
    )
    .then(responseParser);
}
