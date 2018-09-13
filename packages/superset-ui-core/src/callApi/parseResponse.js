const PARSERS = {
  json: response =>
    // first try to parse as json, and fall back to text (e.g., in the case of HTML stacktrace)
    // cannot fall back to .text() without cloning the response because body is single-use
    response
      .clone()
      .json()
      .then(json => ({ json, response }))
      .catch(() => /* jsonParseError */ response.text().then(text => ({ response, text }))),

  text: response => response.text().then(text => ({ response, text })),
};

export default function parseResponse(apiPromise, parseMethod = 'json') {
  const responseParser = PARSERS[parseMethod] || PARSERS.json;

  return apiPromise.then(responseParser).then(({ json, text, response }) => {
    // HTTP 404 or 500 are not rejected, ok is just set to false
    if (!response.ok) {
      return Promise.reject({
        error: response.error || (json && json.error) || text || 'An error occurred',
        status: response.status,
        statusText: response.statusText,
      });
    }

    return typeof text === 'undefined' ? { json, response } : { response, text };
  });
}
