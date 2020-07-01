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
import { JsonValue } from '@superset-ui/connection';
import { makeApi, SupersetApiError } from '../../../src';
import setupClientForTest from '../setupClientForTest';

describe('makeApi()', () => {
  beforeAll(setupClientForTest);
  afterEach(fetchMock.restore);

  it('should expose method and endpoint', () => {
    const api = makeApi({
      method: 'GET',
      endpoint: '/test',
    });
    expect(api.method).toEqual('GET');
    expect(api.endpoint).toEqual('/test');
  });

  it('should obtain json response by default', async () => {
    expect.assertions(1);
    const api = makeApi({
      method: 'GET',
      endpoint: '/test',
    });
    fetchMock.get('glob:*/test', { yes: 'ok' });
    expect(await api({})).toEqual({ yes: 'ok' });
  });

  it('should allow custom parseResponse', async () => {
    expect.assertions(2);
    const responseJson = { items: [1, 2, 3] };
    fetchMock.post('glob:*/test', responseJson);

    const api = makeApi({
      method: 'POST',
      endpoint: '/test',
      processResponse: (json: typeof responseJson) => {
        return json.items.reduce((a: number, b: number) => a + b);
      },
    });
    expect(api.method).toEqual('POST');
    expect(await api({})).toBe(6);
  });

  it('should respect requestType', async () => {
    expect.assertions(3);
    const api = makeApi({
      method: 'POST',
      endpoint: '/test-formdata',
      requestType: 'form',
    });
    fetchMock.post('glob:*/test-formdata', { test: 'ok' });

    expect(await api({ request: 'test' })).toEqual({ test: 'ok' });

    const expected = new FormData();
    expected.append('request', JSON.stringify('test'));
    const received = fetchMock.lastOptions().body as FormData;

    expect(received).toBeInstanceOf(FormData);
    expect(received.get('request')).toEqual(expected.get('request'));
  });

  it('should handle errors', async () => {
    expect.assertions(1);
    const api = makeApi({
      method: 'POST',
      endpoint: '/test-formdata',
      requestType: 'form',
    });
    fetchMock.post('glob:*/test-formdata', { test: 'ok' });
    try {
      await api('<This is an invalid JSON string>');
    } catch (error) {
      expect((error as SupersetApiError).message).toContain('Invalid payload');
    }
  });

  it('should handle error on 200 response', async () => {
    expect.assertions(1);
    const api = makeApi({
      method: 'POST',
      endpoint: '/test-200-error',
      requestType: 'form',
    });
    fetchMock.post('glob:*/test-200-error', { error: 'not ok' });
    try {
      await api({});
    } catch (error) {
      expect((error as SupersetApiError).message).toContain('not ok');
    }
  });

  it('should parse text', async () => {
    expect.assertions(1);
    const api = makeApi<JsonValue, string, 'text'>({
      method: 'PUT',
      endpoint: '/test-parse-text',
      requestType: 'form',
      responseType: 'text',
      processResponse: text => `${text}?`,
    });
    fetchMock.put('glob:*/test-parse-text', 'ok');
    const result = await api({ field1: 11 });
    expect(result).toBe('ok?');
  });
});
