/* eslint promise/no-callback-in-promise: 'off' */
import sinon from 'sinon';
import fetchMock from 'fetch-mock';

import PublicAPI, { SupersetClient } from '../src/SupersetClient';

import { LOGIN_GLOB } from './fixtures/constants';

const THROW_IF_CALLED = () => {
  throw Error('No op error');
};

describe('SupersetClient', () => {
  beforeAll(() => {
    fetchMock.get(LOGIN_GLOB, { csrf_token: '1234' });
  });

  afterAll(fetchMock.restore);

  afterEach(PublicAPI.reset);

  describe('API', () => {
    it('exposes reset, configure, init, get, post, isAuthenticated, and reAuthenticate methods', () => {
      expect(PublicAPI.configure).toEqual(expect.any(Function));
      expect(PublicAPI.init).toEqual(expect.any(Function));
      expect(PublicAPI.get).toEqual(expect.any(Function));
      expect(PublicAPI.post).toEqual(expect.any(Function));
      expect(PublicAPI.isAuthenticated).toEqual(expect.any(Function));
      expect(PublicAPI.reAuthenticate).toEqual(expect.any(Function));
      expect(PublicAPI.reset).toEqual(expect.any(Function));
    });

    it('throws if you call init, get, post, isAuthenticated, or reAuthenticate before configure', () => {
      expect(PublicAPI.init).toThrow();
      expect(PublicAPI.get).toThrow();
      expect(PublicAPI.post).toThrow();
      expect(PublicAPI.isAuthenticated).toThrow();
      expect(PublicAPI.reAuthenticate).toThrow();

      expect(PublicAPI.configure).not.toThrow();
    });

    // this also tests that the ^above doesn't throw if configure is called appropriately
    it('calls appropriate SupersetClient methods when configured', () => {
      const initSpy = sinon.stub(SupersetClient.prototype, 'init');
      const getSpy = sinon.stub(SupersetClient.prototype, 'get');
      const postSpy = sinon.stub(SupersetClient.prototype, 'post');
      const authenticatedSpy = sinon.stub(SupersetClient.prototype, 'isAuthenticated');
      const csrfSpy = sinon.stub(SupersetClient.prototype, 'getCSRFToken');

      PublicAPI.configure({});
      PublicAPI.init();
      PublicAPI.get({});
      PublicAPI.post({});
      PublicAPI.isAuthenticated();
      PublicAPI.reAuthenticate({});

      expect(initSpy.callCount).toBe(1);
      expect(getSpy.callCount).toBe(1);
      expect(postSpy.callCount).toBe(1);
      expect(authenticatedSpy.callCount).toBe(1);
      expect(csrfSpy.callCount).toBe(1); // from reAuthenticate()

      initSpy.restore();
      getSpy.restore();
      postSpy.restore();
      authenticatedSpy.restore();
      csrfSpy.restore();
    });
  });

  describe('SupersetClient', () => {
    it('client.getUnauthorizedError() returns an object with error string', () => {
      const client = new SupersetClient({});
      expect(client.getUnauthorizedError()).toEqual(
        expect.objectContaining({ error: expect.any(String) }),
      );
    });

    describe('CSRF', () => {
      afterEach(fetchMock.reset);

      it('calls superset/csrf_token/ upon initialization', done => {
        expect.assertions(1);
        const client = new SupersetClient({});

        client
          .init()
          .then(() => {
            expect(fetchMock.calls(LOGIN_GLOB)).toHaveLength(1);

            return done();
          })
          .catch(THROW_IF_CALLED);
      });

      it('isAuthenticated() returns true if there is a token and false if not', done => {
        expect.assertions(2);
        const client = new SupersetClient({});
        expect(client.isAuthenticated()).toBe(false);

        client
          .init()
          .then(() => {
            expect(client.isAuthenticated()).toBe(true);

            return done();
          })
          .catch(THROW_IF_CALLED);
      });

      it('throws if superset/csrf_token/ returns an error', done => {
        expect.assertions(1);

        fetchMock.get(LOGIN_GLOB, () => Promise.reject({ status: 403 }), {
          overwriteRoutes: true,
        });

        const client = new SupersetClient({});

        client
          .init()
          .then(THROW_IF_CALLED)
          .catch(error => {
            expect(error.status).toBe(403);

            // reset
            fetchMock.get(
              LOGIN_GLOB,
              { csrf_token: 1234 },
              {
                overwriteRoutes: true,
              },
            );

            return done();
          });
      });

      it('throws if superset/csrf_token/ does not return a token', done => {
        expect.assertions(1);
        fetchMock.get(LOGIN_GLOB, {}, { overwriteRoutes: true });

        const client = new SupersetClient({});
        client
          .init()
          .then(THROW_IF_CALLED)
          .catch(error => {
            expect(error).toBeDefined();

            // reset
            fetchMock.get(
              LOGIN_GLOB,
              { csrf_token: 1234 },
              {
                overwriteRoutes: true,
              },
            );

            return done();
          });
      });
    });

    // describe('authorization queuing', () => {
    //   it('client.ensureAuth returns a promise that resolves if client.didAuthSuccessfully is true', done => {});
    //
    //   it('client.ensureAuth calls client.waitForCSRF if client.didAuthSuccessfully is false', done => {});
    //
    //   it('client.waitForCSRF resolves if', done => {});
    //   it('client.waitForCSRF rejects if', done => {});
    //   it('client.waitForCSRF calls itself if ', done => {});
    // });

    describe('requests', () => {
      afterEach(fetchMock.reset);
      const protocol = 'PROTOCOL';
      const host = 'HOST';
      const mockGetEndpoint = '/get/url';
      const mockPostEndpoint = '/post/url';
      const mockGetUrl = `${protocol}://${host}${mockGetEndpoint}`;
      const mockPostUrl = `${protocol}://${host}${mockPostEndpoint}`;

      fetchMock.get(mockGetUrl, 'Ok');
      fetchMock.post(mockPostUrl, 'Ok');

      it('checks for authentication before every get and post request', done => {
        expect.assertions(3);
        const authSpy = sinon.stub(SupersetClient.prototype, 'ensureAuth').resolves();
        const client = new SupersetClient({ protocol, host });

        client.init();

        Promise.all([client.get({ url: mockGetUrl }), client.post({ url: mockPostUrl })])
          .then(() => {
            expect(fetchMock.calls(mockGetUrl)).toHaveLength(1);
            expect(fetchMock.calls(mockPostUrl)).toHaveLength(1);
            expect(authSpy.callCount).toBe(2);

            return done();
          })
          .catch(THROW_IF_CALLED);
      });

      it('sets protocol, host, headers, mode, and credentials from config', done => {
        expect.assertions(3);
        const clientConfig = {
          host,
          protocol,
          mode: 'a la mode',
          credentials: 'mad cred',
          headers: { my: 'header' },
        };

        const client = new SupersetClient(clientConfig);
        client.init();

        client
          .get({ url: mockGetUrl })
          .then(() => {
            const fetchRequest = fetchMock.calls(mockGetUrl)[0][1];
            expect(fetchRequest.mode).toBe(clientConfig.mode);
            expect(fetchRequest.credentials).toBe(clientConfig.credentials);
            expect(fetchRequest.headers).toEqual(expect.objectContaining(clientConfig.headers));

            return done();
          })
          .catch(THROW_IF_CALLED);
      });

      describe('GET', () => {
        it('makes a request using url or endpoint', done => {
          expect.assertions(1);
          const client = new SupersetClient({ protocol, host });
          client.init();

          Promise.all([client.get({ url: mockGetUrl }), client.get({ endpoint: mockGetEndpoint })])
            .then(() => {
              expect(fetchMock.calls(mockGetUrl)).toHaveLength(2);

              return done();
            })
            .catch(THROW_IF_CALLED);
        });

        it('allows overriding host, headers, mode, and credentials per-request', done => {
          expect.assertions(3);
          const clientConfig = {
            host,
            protocol,
            mode: 'a la mode',
            credentials: 'mad cred',
            headers: { my: 'header' },
          };

          const overrideConfig = {
            host: 'override_host',
            mode: 'override mode',
            credentials: 'override credentials',
            headers: { my: 'override', another: 'header' },
          };

          const client = new SupersetClient(clientConfig);
          client.init();

          client
            .get({ url: mockGetUrl, ...overrideConfig })
            .then(() => {
              const fetchRequest = fetchMock.calls(mockGetUrl)[0][1];
              expect(fetchRequest.mode).toBe(overrideConfig.mode);
              expect(fetchRequest.credentials).toBe(overrideConfig.credentials);
              expect(fetchRequest.headers).toEqual(expect.objectContaining(overrideConfig.headers));

              return done();
            })
            .catch(THROW_IF_CALLED);
        });
      });

      describe('POST', () => {
        it('makes a request using url or endpoint', done => {
          expect.assertions(1);
          const client = new SupersetClient({ protocol, host });
          client.init();

          Promise.all([
            client.post({ url: mockPostUrl }),
            client.post({ endpoint: mockPostEndpoint }),
          ])
            .then(() => {
              expect(fetchMock.calls(mockPostUrl)).toHaveLength(2);

              return done();
            })
            .catch(THROW_IF_CALLED);
        });

        it('allows overriding host, headers, mode, and credentials per-request', done => {
          const clientConfig = {
            host,
            protocol,
            mode: 'a la mode',
            credentials: 'mad cred',
            headers: { my: 'header' },
          };

          const overrideConfig = {
            host: 'override_host',
            mode: 'override mode',
            credentials: 'override credentials',
            headers: { my: 'override', another: 'header' },
          };

          const client = new SupersetClient(clientConfig);
          client.init();
          client.post({ url: mockPostUrl, ...overrideConfig });

          setTimeout(() => {
            const fetchRequest = fetchMock.calls(mockPostUrl)[0][1];
            expect(fetchRequest.mode).toBe(overrideConfig.mode);
            expect(fetchRequest.credentials).toBe(overrideConfig.credentials);
            expect(fetchRequest.headers).toEqual(expect.objectContaining(overrideConfig.headers));
            done();
          });
        });

        it('passes postPayload key,values in the body', done => {
          expect.assertions(3);

          const postPayload = { number: 123, array: [1, 2, 3] };
          const client = new SupersetClient({ protocol, host });
          client.init();

          client
            .post({ url: mockPostUrl, postPayload })
            .then(() => {
              const formData = fetchMock.calls(mockPostUrl)[0][1].body;
              expect(fetchMock.calls(mockPostUrl)).toHaveLength(1);
              Object.keys(postPayload).forEach(key => {
                expect(formData.get(key)).toBe(JSON.stringify(postPayload[key]));
              });

              return done();
            })
            .catch(THROW_IF_CALLED);
        });

        it('respects the stringify parameter for postPayload key,values', done => {
          expect.assertions(3);
          const postPayload = { number: 123, array: [1, 2, 3] };
          const client = new SupersetClient({ protocol, host });
          client.init();

          client
            .post({ url: mockPostUrl, postPayload, stringify: false })
            .then(() => {
              const formData = fetchMock.calls(mockPostUrl)[0][1].body;
              expect(fetchMock.calls(mockPostUrl)).toHaveLength(1);
              Object.keys(postPayload).forEach(key => {
                expect(formData.get(key)).toBe(String(postPayload[key]));
              });

              return done();
            })
            .catch(THROW_IF_CALLED);
        });
      });
    });
  });
});
