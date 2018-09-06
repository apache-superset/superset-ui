/* eslint promise/no-callback-in-promise: 'off' */
import sinon from 'sinon';
import fetchMock from 'fetch-mock';

import { callApi } from '../src';

import { LOGIN_GLOB } from './fixtures/constants';

const THROW_IF_CALLED = () => {
  throw Error('Unexpected call to THROW_IF_CALLED');
};

describe('callApi', () => {
  beforeAll(() => {
    fetchMock.get(LOGIN_GLOB, { csrf_token: '1234' });
  });

  afterAll(fetchMock.restore);

  const mockGetUrl = '/mock/get/url';
  const mockPostUrl = '/mock/post/url';
  const mockErrorUrl = '/mock/error/url';

  const mockGetPayload = { get: 'payload' };
  const mockPostPayload = { post: 'payload' };
  const mockErrorPayload = { status: 500, statusText: 'Internal errorz!' };

  fetchMock.get(mockGetUrl, mockGetPayload);
  fetchMock.post(mockPostUrl, mockPostPayload);
  fetchMock.get(mockErrorUrl, () => Promise.reject(mockErrorPayload));

  afterEach(fetchMock.reset);

  describe('request config', () => {
    it('calls the right url with the specified method', done => {
      expect.assertions(2);

      Promise.all([
        callApi({ url: mockGetUrl, method: 'GET' }),
        callApi({ url: mockPostUrl, method: 'POST' }),
      ])
        .then(() => {
          expect(fetchMock.calls(mockGetUrl)).toHaveLength(1);
          expect(fetchMock.calls(mockPostUrl)).toHaveLength(1);

          return done();
        })
        .catch(THROW_IF_CALLED);
    });

    it('passes along mode, cache, credentials, headers, body, signal, and redirect parameters in the request', done => {
      expect.assertions(8);

      const mockRequest = {
        url: mockGetUrl,
        mode: 'my-mode',
        cache: 'cash money',
        credentials: 'mad cred',
        headers: {
          custom: 'header',
        },
        redirect: 'no thanks',
        signal: () => {},
        body: 'BODY',
      };

      callApi(mockRequest)
        .then(() => {
          const calls = fetchMock.calls(mockGetUrl);
          const fetchParams = calls[0][1];
          expect(calls).toHaveLength(1);
          expect(fetchParams.mode).toBe(mockRequest.mode);
          expect(fetchParams.cache).toBe(mockRequest.cache);
          expect(fetchParams.credentials).toBe(mockRequest.credentials);
          expect(fetchParams.headers).toEqual(expect.objectContaining(mockRequest.headers));
          expect(fetchParams.redirect).toBe(mockRequest.redirect);
          expect(fetchParams.signal).toBe(mockRequest.signal);
          expect(fetchParams.body).toBe(mockRequest.body);

          return done();
        })
        .catch(THROW_IF_CALLED);
    });
  });

  describe('POST requests', () => {
    it('encodes key,value pairs from postPayload', done => {
      expect.assertions(3);
      const postPayload = { key: 'value', anotherKey: 1237 };

      callApi({ url: mockPostUrl, method: 'POST', postPayload })
        .then(() => {
          const calls = fetchMock.calls(mockPostUrl);
          expect(calls).toHaveLength(1);

          const fetchParams = calls[0][1];
          const { body } = fetchParams;

          Object.keys(postPayload).forEach(key => {
            expect(body.get(key)).toBe(JSON.stringify(postPayload[key]));
          });

          return done();
        })
        .catch(THROW_IF_CALLED);
    });

    // the reason for this is to omit strings like 'undefined' from making their way to the backend
    it('omits key,value pairs from postPayload that have undefined values', done => {
      expect.assertions(3);
      const postPayload = { key: 'value', noValue: undefined };

      callApi({ url: mockPostUrl, method: 'POST', postPayload })
        .then(() => {
          const calls = fetchMock.calls(mockPostUrl);
          expect(calls).toHaveLength(1);

          const fetchParams = calls[0][1];
          const { body } = fetchParams;
          expect(body.get('key')).toBe(JSON.stringify(postPayload.key));
          expect(body.get('noValue')).toBeNull();

          return done();
        })
        .catch(THROW_IF_CALLED);
    });

    it('respects the stringify flag in POST requests', done => {
      const postPayload = {
        string: 'value',
        number: 1237,
        array: [1, 2, 3],
        object: { a: 'a', 1: 1 },
        null: null,
        emptyString: '',
      };

      expect.assertions(1 + 2 * Object.keys(postPayload).length);

      Promise.all([
        callApi({ url: mockPostUrl, method: 'POST', postPayload }),
        callApi({ url: mockPostUrl, method: 'POST', postPayload, stringify: false }),
      ])
        .then(() => {
          const calls = fetchMock.calls(mockPostUrl);
          expect(calls).toHaveLength(2);

          const stringified = calls[0][1].body;
          const unstringified = calls[1][1].body;

          Object.keys(postPayload).forEach(key => {
            expect(stringified.get(key)).toBe(JSON.stringify(postPayload[key]));
            expect(unstringified.get(key)).toBe(String(postPayload[key]));
          });

          return done();
        })
        .catch(THROW_IF_CALLED);
    });
  });

  describe('Promises', () => {
    let promiseResolveSpy;
    let promiseRejectSpy;

    beforeEach(() => {
      promiseResolveSpy = sinon.spy(Promise, 'resolve');
      promiseRejectSpy = sinon.spy(Promise, 'reject');
    });

    afterEach(() => {
      promiseResolveSpy.restore();
      promiseRejectSpy.restore();
    });

    it('resolves to { json, response } if the request succeeds', done => {
      expect.assertions(5);

      callApi({ url: mockGetUrl, method: 'GET' })
        .then(args => {
          expect(fetchMock.calls(mockGetUrl)).toHaveLength(1);

          // 1. fetch resolves
          // 2. timeout promise (unresolved)
          // 3. final resolve with json payload
          expect(promiseResolveSpy.callCount).toBe(3);
          expect(promiseRejectSpy.callCount).toBe(0);
          expect(Object.keys(args)).toEqual(expect.arrayContaining(['response', 'json']));
          expect(args.json).toEqual(expect.objectContaining(mockGetPayload));

          return done();
        })
        .catch(THROW_IF_CALLED);
    });

    it('resolves to { text, response } if the request succeeds with text response', done => {
      expect.assertions(5);

      const mockTextUrl = '/mock/text/url';
      const mockTextResponse =
        '<html><head></head><body>I could be a stack trace or something</body></html>';
      fetchMock.get(mockTextUrl, mockTextResponse);

      callApi({ url: mockTextUrl, method: 'GET' })
        .then(args => {
          expect(fetchMock.calls(mockTextUrl)).toHaveLength(1);

          // 1. fetch resolves
          // 2. timeout promise (unresolved)
          // 3. final resolve with text payload
          expect(promiseResolveSpy.callCount).toBe(3);
          expect(promiseRejectSpy.callCount).toBe(0);
          expect(Object.keys(args)).toEqual(expect.arrayContaining(['response', 'text']));
          expect(args.text).toBe(mockTextResponse);

          return done();
        })
        .catch(THROW_IF_CALLED);
    });

    it('rejects if the request throws', done => {
      expect.assertions(5);

      callApi({ url: mockErrorUrl, method: 'GET' })
        .then(THROW_IF_CALLED)
        .catch(error => {
          expect(fetchMock.calls(mockErrorUrl)).toHaveLength(1);

          // 1. fetch resolves
          // 2. timeout promise (unresolved)
          // 3. reject above
          // 4. rejects from fetch error
          expect(promiseResolveSpy.callCount).toBe(2);
          expect(promiseRejectSpy.callCount).toBe(2);
          expect(error.status).toBe(mockErrorPayload.status);
          expect(error.statusText).toBe(mockErrorPayload.statusText);

          return done();
        });
    });

    it('rejects if the request exceeds the timeout passed', done => {
      expect.assertions(5);

      const mockTimeoutUrl = '/mock/timeout/url';
      const unresolvingPromise = new Promise(() => {});

      fetchMock.get(mockTimeoutUrl, () => unresolvingPromise);

      callApi({ url: mockTimeoutUrl, method: 'GET', timeout: 0 })
        .then(THROW_IF_CALLED)
        .catch(timeoutError => {
          expect(fetchMock.calls(mockTimeoutUrl)).toHaveLength(1);

          // 1. unresolved fetch
          // 2. Promise.race resolves with timeout error, not seen in reject spy because it calls
          //    reject not Promise.reject. We assert this via the error closure above.
          expect(promiseResolveSpy.callCount).toBe(2);
          expect(promiseRejectSpy.callCount).toBe(0);
          expect(Object.keys(timeoutError)).toEqual(
            expect.arrayContaining(['error', 'statusText']),
          );
          expect(timeoutError.statusText).toBe('timeout');

          return done();
        });
    });

    it('clears the request timeout when a request returns', done => {
      expect.assertions(1);
      jest.useFakeTimers(); // track clearTimeout calls

      callApi({ url: mockGetUrl, method: 'GET', timeout: 100 })
        .then(() => {
          expect(clearTimeout).toHaveBeenCalledTimes(1);

          return done();
        })
        .catch(THROW_IF_CALLED);
    });

    it('clears the request timeout when a request throws', done => {
      expect.assertions(1);
      jest.useFakeTimers(); // track clearTimeout calls

      callApi({ url: mockErrorUrl, method: 'GET', timeout: 100 })
        .then(THROW_IF_CALLED)
        .catch(() => {
          expect(clearTimeout).toHaveBeenCalledTimes(1);

          return done();
        });
    });
  });
});
