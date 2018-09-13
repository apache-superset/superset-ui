export default function parseResponse(apiPromise, parseMethod = 'json') {
  return apiPromise.then(response => {
    let parsedPromise;
    if (parseMethod === 'json') {
      // first try to parse as json, and fall back to text (e.g., in the case of HTML stacktrace)
      // cannot fall back to .text() without cloning the response because body is single-use
      parsedPromise = response
        .clone()
        .json()
        .catch(() => /* jsonParseError */ response.text().then(textPayload => ({ textPayload })));
    } else if (parseMethod === 'text') {
      parsedPromise = response.text().then(textPayload => ({ textPayload }));
    } else {
      throw Error(`Unrecognized parseMethod '${parseMethod}', expected 'json' or 'text'`);
    }

    return parsedPromise
      .then(maybeJson => ({
        json: maybeJson.textPayload ? undefined : maybeJson,
        text: maybeJson.textPayload,
      }))
      .then(({ json, text }) => {
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
  });
}
