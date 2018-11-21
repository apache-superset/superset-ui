type body = RequestInit['body'];
type cache = RequestInit['cache'];
type credentials = RequestInit['credentials'];
type csrfToken = string;
type endpoint = string;
type headers = { [key: string]: string };
type host = string;
type method = RequestInit['method'];
type protocol = 'http:' | 'https:' | 'file:';
type postPayload = { [key: string]: any };
type mode = RequestInit['mode'];
type redirect = RequestInit['redirect'];
type timeout = number | void;
type parseMethod = 'json' | 'text' | null;
type signal = RequestInit['signal'];
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

interface CallApi {
  body: body;
  cache: cache;
  credentials: credentials;
  headers: headers;
  method: method;
  mode: mode;
  postPayload: postPayload | void;
  redirect: redirect;
  signal: signal;
  stringify: stringify;
  url: url;
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
