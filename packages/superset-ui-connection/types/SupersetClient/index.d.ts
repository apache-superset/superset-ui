type body = { [key: string]: any } | Object | string;
type credentials = 'same-origin' | 'include' | 'omit';
type csrfToken = string;
type endpoint = string;
type headers = { [key: string]: any } | Object;
type host = string;
type protocol = 'http:' | 'https:' | 'file:';
type postPayload = { [key: string]: any } | Object;
type mode = 'cors' | 'no-cors' | 'same-origin';
type timeout = number | void;
type parseMethod = 'json' | 'text' | null;
type signal = AbortController;
type stringify = boolean;
type url = string;

interface ClientConfig {
  credentials?: credentials;
  csrfToken?: csrfToken;
  headers?: headers;
  host?: host;
  protocol?: protocol;
  mode?: mode;
  timeout?: timeout;
}

interface RequestBase {
  body?: body;
  credentials?: credentials;
  headers?: headers;
  host?: host;
  mode?: mode;
  parseMethod?: parseMethod;
  postPayload?: postPayload;
  signal?: signal;
  stringify?: stringify;
  timeout?: timeout;
}

interface RequestWithEndpoint extends RequestBase {
  endpoint: endpoint;
  url?: undefined;
}

interface RequestWithUrl extends RequestBase {
  url: url;
  endpoint?: undefined;
}

type RequestConfig = RequestWithEndpoint | RequestWithUrl;
