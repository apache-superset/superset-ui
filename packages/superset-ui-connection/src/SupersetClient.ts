import callApi from './callApi';

class SupersetClient {
  private credentials: credentials | void;

  private csrfToken: csrfToken | void;

  private csrfPromise: Promise<string>;

  private protocol: protocol;

  private host: host;

  private headers: headers;

  private mode: mode;

  private timeout: timeout;

  constructor(config: ClientConfig) {
    const {
      protocol = 'http:',
      host = 'localhost',
      headers = {},
      mode = 'same-origin',
      timeout,
      credentials,
      csrfToken = undefined,
    }: ClientConfig = config;

    this.headers = { ...headers, 'X-CSRFToken': csrfToken };
    this.host = host;
    this.mode = mode;
    this.timeout = timeout;
    this.protocol = protocol;
    this.credentials = credentials;
    this.csrfToken = csrfToken;
    this.csrfPromise =
      this.csrfToken !== null && this.csrfToken !== undefined
        ? Promise.resolve(this.csrfToken)
        : Promise.reject('Either call Client.init() or pass csrfToken in configuration');
  }

  public isAuthenticated(): boolean {
    // if CSRF protection is disabled in the Superset app, the token may be an empty string
    return this.csrfToken !== null && this.csrfToken !== undefined;
  }

  public init(force: boolean = false) {
    if (this.isAuthenticated() && !force) {
      return this.csrfPromise;
    }

    return this.getCSRFToken();
  }

  private getCSRFToken() {
    this.csrfToken = undefined;

    // If we can request this resource successfully, it means that the user has
    // authenticated. If not we throw an error prompting to authenticate.
    this.csrfPromise = callApi({
      credentials: this.credentials,
      headers: {
        ...this.headers,
      },
      method: 'GET',
      mode: this.mode,
      timeout: this.timeout,
      url: this.getUrl({ endpoint: 'superset/csrf_token/', host: this.host }),
    }).then((response: { json: { csrf_token: string } }) => {
      if (response.json) {
        this.csrfToken = response.json.csrf_token;
        this.headers = { ...this.headers, 'X-CSRFToken': this.csrfToken };
      }

      if (!this.isAuthenticated()) {
        return Promise.reject({ error: 'Failed to fetch CSRF token' });
      }

      return this.csrfToken;
    });

    return this.csrfPromise;
  }

  private getUrl({ host = '', endpoint = '' }: { host: string; endpoint?: string }) {
    const cleanHost = host.slice(-1) === '/' ? host.slice(0, -1) : host; // no backslash

    return `${this.protocol}//${cleanHost}/${endpoint[0] === '/' ? endpoint.slice(1) : endpoint}`;
  }

  private ensureAuth() {
    return (
      this.csrfPromise ||
      Promise.reject({
        error: `SupersetClient has no CSRF token, ensure it is initialized or
        try logging into the Superset instance at ${this.getUrl({
          host: this.host,
          endpoint: '/login',
        })}`,
      })
    );
  }

  public get({
    body,
    credentials,
    headers,
    host,
    endpoint,
    mode,
    parseMethod,
    signal,
    timeout,
    url,
  }: RequestConfig): Promise<any> {
    return this.ensureAuth().then(() =>
      callApi({
        body,
        credentials: credentials || this.credentials,
        headers: { ...this.headers, ...headers },
        method: 'GET',
        mode: mode || this.mode,
        parseMethod,
        signal,
        timeout: timeout || this.timeout,
        url: url || this.getUrl({ endpoint, host: host || this.host }),
      }),
    );
  }

  public post({
    credentials,
    headers,
    host,
    endpoint,
    mode,
    parseMethod,
    postPayload,
    signal,
    stringify,
    timeout,
    url,
  }: RequestConfig): Promise<any> {
    return this.ensureAuth().then(() =>
      callApi({
        credentials: credentials || this.credentials,
        headers: { ...this.headers, ...headers },
        method: 'POST',
        mode: mode || this.mode,
        parseMethod,
        postPayload,
        signal,
        stringify,
        timeout: timeout || this.timeout,
        url: url || this.getUrl({ endpoint, host: host || this.host }),
      }),
    );
  }
}

let singletonClient: SupersetClient;

function hasInstance(): true | Error {
  if (!singletonClient) {
    return new Error('You must call SupersetClient.configure(...) before calling other methods');
  }

  return true;
}

const PublicAPI = {
  configure: (config: ClientConfig = {}): SupersetClient => {
    singletonClient = new SupersetClient(config);

    return singletonClient;
  },
  get: (request: RequestConfig): Promise<any> =>
    hasInstance() && singletonClient && singletonClient.get(request),
  init: (force: boolean): Promise<any> => hasInstance() && singletonClient.init(force),
  isAuthenticated: (): boolean => hasInstance() && singletonClient.isAuthenticated(),
  post: (request: RequestConfig): Promise<any> => hasInstance() && singletonClient.post(request),
  reAuthenticate: (): Promise<any> => hasInstance() && singletonClient.init(/* force = */ true),
};

export { SupersetClient };

export default PublicAPI;
