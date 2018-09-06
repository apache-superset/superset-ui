import callApi from './callApi';

const AUTH_QUEUE_POLL_MS = 30;

class SupersetClient {
  constructor(config) {
    const {
      protocol = 'http',
      host = '',
      headers = {},
      mode = 'same-origin',
      timeout,
      credentials,
    } = config;

    this.headers = headers;
    this.host = host;
    this.mode = mode;
    this.timeout = timeout;
    this.protocol = protocol;
    this.credentials = credentials;
    this.csrfToken = null;
    this.didAuthSuccessfully = false;
    this.requestingCsrf = false;
  }

  isAuthenticated() {
    return this.didAuthSuccessfully;
  }

  init() {
    return this.getCSRFToken();
  }

  getCSRFToken() {
    this.requestingCsrf = true;

    // If we can request this resource successfully, it means that the user has
    // authenticated. If not we throw an error prompting to authenticate.
    return callApi({
      credentials: this.credentials,
      headers: {
        ...this.headers,
      },
      method: 'GET',
      mode: this.mode,
      timeout: this.timeout,
      url: this.getUrl({ endpoint: 'superset/csrf_token/', host: this.host }),
    })
      .then(response => {
        if (response.json) {
          this.csrfToken = response.json.csrf_token;
          this.headers = { ...this.headers, 'X-CSRFToken': this.csrfToken };
          this.didAuthSuccessfully = !!this.csrfToken;
        }

        if (!this.csrfToken) {
          return Promise.reject({ error: 'Failed to fetch CSRF token' });
        }

        this.requestingCsrf = false;

        return response;
      })
      .catch(error => Promise.reject(error));
  }

  getUrl({ host = '', endpoint }) {
    const cleanHost = host.slice(-1) === '/' ? host.slice(0, -1) : host; // no backslash

    return `${this.protocol}://${cleanHost}/${endpoint[0] === '/' ? endpoint.slice(1) : endpoint}`;
  }

  getUnauthorizedError() {
    return {
      error: `No CSRF token, ensure you called client.init() or try logging into Superset instance at ${
        this.host
      }/login`,
    };
  }

  waitForCSRF(resolve, reject) {
    if (!this.requestingCsrf && this.didAuthSuccessfully) {
      return resolve();
    } else if (!this.requestingCsrf && !this.didAuthSuccessfully) {
      return reject(this.getUnauthorizedError());
    }

    // @TODO test that you can pass args this way
    setTimeout(this.waitForCSRF, AUTH_QUEUE_POLL_MS, resolve, reject);

    return null;
  }

  ensureAuth() {
    return new Promise((resolve, reject) => {
      if (this.didAuthSuccessfully) {
        return resolve();
      } else if (this.requestingCsrf) {
        // const waitForCSRF = () => {
        //   /* eslint-disable react/no-this-in-sfc */
        //   if (!this.requestingCsrf && this.didAuthSuccessfully) {
        //     return resolve();
        //   } else if (!this.requestingCsrf && !this.didAuthSuccessfully) {
        //     return reject(this.getUnauthorizedError());
        //   }
        //   /* eslint-enable react/no-this-in-sfc */
        //   setTimeout(waitForCSRF, AUTH_QUEUE_POLL_MS);
        //
        //   return null;
        // };

        return this.waitForCSRF(resolve, reject);
      }

      return reject(this.getUnauthorizedError());
    });
  }

  get({ host, url, endpoint, mode, credentials, headers, body, timeout, signal }) {
    return this.ensureAuth().then(() =>
      callApi({
        body,
        credentials: credentials || this.credentials,
        headers: { ...this.headers, ...headers },
        method: 'GET',
        mode: mode || this.mode,
        signal,
        timeout: timeout || this.timeout,
        url: url || this.getUrl({ endpoint, host: host || this.host }),
      }),
    );
  }

  post({
    host,
    endpoint,
    url,
    mode,
    credentials,
    headers,
    postPayload,
    timeout,
    signal,
    stringify,
  }) {
    return this.ensureAuth().then(() =>
      callApi({
        credentials: credentials || this.credentials,
        headers: { ...this.headers, ...headers },
        method: 'POST',
        mode: mode || this.mode,
        postPayload,
        signal,
        stringify,
        timeout: timeout || this.timeout,
        url: url || this.getUrl({ endpoint, host: host || this.host }),
      }),
    );
  }
}

let singletonClient;

function hasInstance() {
  if (!singletonClient) {
    throw new Error('You must call SupersetClient.configure(...) before calling other methods');
  }

  return true;
}

const PublicAPI = {
  configure: config => {
    singletonClient = new SupersetClient(config || {});

    return singletonClient;
  },
  get: (...args) => hasInstance() && singletonClient.get(...args),
  init: () => hasInstance() && singletonClient.init(),
  isAuthenticated: () => hasInstance() && singletonClient.isAuthenticated(),
  post: (...args) => hasInstance() && singletonClient.post(...args),
  reAuthenticate: () => hasInstance() && singletonClient.getCSRFToken(),
  reset: () => {
    singletonClient = null;
  },
};

export { SupersetClient };

export default PublicAPI;
