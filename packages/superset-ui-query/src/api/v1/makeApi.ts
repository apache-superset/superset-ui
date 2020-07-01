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
import {
  SupersetClient,
  Payload as SupersetPayload,
  JsonObject,
  JsonValue,
  ParseMethod,
  Endpoint,
  Method,
} from '@superset-ui/connection';
import handleError, { ErrorType } from './handleError';
import { SupersetApiRequestOptions, SupersetApiErrorPayload, ParsedResponseType } from './types';

interface SupersetApiFactoryOptions {
  endpoint: Endpoint;
  method: Method;
  requestType?: 'form' | 'json';
  responseType?: ParseMethod;
}

/**
 * Generate an API caller with predefined configs/typing and consistent
 * return values.
 */
export default function makeApi<
  Payload = SupersetPayload,
  Result = JsonObject,
  T extends ParseMethod = ParseMethod
>({
  endpoint,
  method,
  requestType = 'json',
  responseType,
  processResponse,
  ...requestOptions
}: SupersetApiFactoryOptions & {
  responseType?: T;
  // further process response JSON or text
  processResponse?(result: ParsedResponseType<T>): Result;
}) {
  async function request(
    payload: Payload,
    { client = SupersetClient }: SupersetApiRequestOptions = { client: SupersetClient },
  ): Promise<Result> {
    try {
      const requestConfig = {
        ...requestOptions,
        method,
        endpoint,
        postPayload: requestType === 'form' ? payload : undefined,
        jsonPayload: requestType === 'json' ? payload : undefined,
      };
      let result: JsonValue | Response;
      const response = await client.request({ ...requestConfig, parseMethod: 'raw' });
      if (responseType === 'text') {
        result = await response.text();
      } else if (responseType === 'raw' || responseType === null) {
        result = response;
      } else {
        result = await response.json();
        // if response json has an "error" field
        if (result && typeof result === 'object' && 'error' in result) {
          return handleError(result as SupersetApiErrorPayload);
        }
      }
      const typedResult = result as ParsedResponseType<T>;
      return (processResponse ? processResponse(typedResult) : typedResult) as Result;
    } catch (error) {
      return handleError(error as ErrorType);
    }
  }

  request.method = method;
  request.endpoint = endpoint;

  return request;
}
