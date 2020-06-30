/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import fetchMock from 'fetch-mock';
import callApi from '../../src/callApi/callApi';
import parseResponse from '../../src/callApi/parseResponse';

import { LOGIN_GLOB } from '../fixtures/constants';

describe('parseResponse()', () => {
  beforeAll(() => {
    fetchMock.get(LOGIN_GLOB, { csrf_token: '1234' });
  });

  afterAll(fetchMock.restore);

  const mockGetUrl = '/mock/get/url';
  const mockPostUrl = '/mock/post/url';
  const mockErrorUrl = '/mock/error/url';
  const mockNoParseUrl = '/mock/noparse/url';

  const mockGetPayload = { get: 'payload' };
  const mockPostPayload = { post: 'payload' };
  const mockErrorPayload = { status: 500, statusText: 'Internal error' };

  fetchMock.get(mockGetUrl, mockGetPayload);
  fetchMock.post(mockPostUrl, mockPostPayload);
  fetchMock.get(mockErrorUrl, () => Promise.reject(mockErrorPayload));
  fetchMock.get(mockNoParseUrl, new Response('test response'));

  afterEach(fetchMock.reset);

  it('returns a Promise', () => {
    const apiPromise = callApi({ url: mockGetUrl, method: 'GET' });
    const parsedResponsePromise = parseResponse(apiPromise);
    expect(parsedResponsePromise).toBeInstanceOf(Promise);
  });

  it('resolves to { json, response } if the request succeeds', async () => {
    expect.assertions(4);
    const args = await parseResponse(callApi({ url: mockGetUrl, method: 'GET' }));
    expect(fetchMock.calls(mockGetUrl)).toHaveLength(1);
    const keys = Object.keys(args);
    expect(keys).toContain('response');
    expect(keys).toContain('json');
    expect(args.json).toEqual(expect.objectContaining(mockGetPayload) as typeof args.json);
  });

  it('throws if `parseMethod=json` and .json() fails', async () => {
    expect.assertions(3);

    const mockTextUrl = '/mock/text/url';
    const mockTextResponse =
      '<html><head></head><body>I could be a stack trace or something</body></html>';
    fetchMock.get(mockTextUrl, mockTextResponse);

    try {
      await parseResponse(callApi({ url: mockTextUrl, method: 'GET' }));
    } catch (error) {
      const err = error as Error;
      expect(fetchMock.calls(mockTextUrl)).toHaveLength(1);
      expect(err.stack).toBeDefined();
      expect(err.message).toContain('Unexpected token');
    }
  });

  it('resolves to { text, response } if the `parseMethod=text`', async () => {
    expect.assertions(4);

    // test with json + bigint to ensure that it was not first parsed as json
    const mockTextParseUrl = '/mock/textparse/url';
    const mockTextJsonResponse = '{ "value": 9223372036854775807 }';
    fetchMock.get(mockTextParseUrl, mockTextJsonResponse);

    const args = await parseResponse<'text'>(
      callApi({ url: mockTextParseUrl, method: 'GET' }),
      'text',
    );
    expect(fetchMock.calls(mockTextParseUrl)).toHaveLength(1);
    const keys = Object.keys(args);
    expect(keys).toContain('response');
    expect(keys).toContain('text');
    expect(args.text).toBe(mockTextJsonResponse);
  });

  it('throws if parseMethod is not null|json|text', () => {
    const apiPromise = callApi({ url: mockNoParseUrl, method: 'GET' });
    expect(() => parseResponse(apiPromise, 'something-else' as never)).toThrow();
  });

  it('resolves to the unmodified `Response` object if `parseMethod=null`', async () => {
    expect.assertions(2);
    const response = await parseResponse<'raw'>(
      callApi({ url: mockNoParseUrl, method: 'GET' }),
      null,
    );
    expect(fetchMock.calls(mockNoParseUrl)).toHaveLength(1);
    expect(response.bodyUsed).toBe(false);
  });

  it('rejects if request.ok=false', async () => {
    const mockNotOkayUrl = '/mock/notokay/url';
    fetchMock.get(mockNotOkayUrl, 404); // 404s result in not response.ok=false

    expect.assertions(3);
    const apiPromise = callApi({ url: mockNotOkayUrl, method: 'GET' });

    try {
      await parseResponse(apiPromise);
    } catch (error) {
      const err = error as { ok: boolean; status: number };
      expect(fetchMock.calls(mockNotOkayUrl)).toHaveLength(1);
      expect(err.ok).toBe(false);
      expect(err.status).toBe(404);
    }
  });
});
