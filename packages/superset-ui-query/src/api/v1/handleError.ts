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
  SupersetApiError,
  SupersetApiErrorPayload,
  SupersetApiHttpErrorPayload,
  SupersetApiHttpMultiErrorsPayload,
} from './types';

export type ErrorType = string | Error | Response | SupersetApiErrorPayload;

/**
 * Handle API request errors, convert to consistent Superset API error.
 * @param error the catched error from SupersetClient.request(...)
 */
export default async function handleError(error: ErrorType): Promise<never> {
  // string is the error message itself
  if (typeof error === 'string') {
    throw new SupersetApiError({ message: error });
  }
  // catch HTTP errors
  if (error instanceof Response) {
    const { status, statusText } = error;
    if (status >= 400) {
      let errorMessage = `${status} ${statusText}`;
      try {
        const json = (await error.json()) as
          | SupersetApiHttpErrorPayload
          | SupersetApiHttpMultiErrorsPayload;
        const err = 'errors' in json ? json.errors[0] : json;
        errorMessage = err.message || err.error_type || errorMessage;
      } catch (error_) {
        // pass
      }
      throw new SupersetApiError({
        status,
        statusText,
        message: errorMessage,
      });
    }
  }
  // JS errors, normally happens before request was sent
  if (error instanceof Error) {
    throw new SupersetApiError({
      message: error.message || 'Unknown Error',
      stack: error.stack,
      // pass along the raw error so consumer code can inspect trace stack
      originalError: error,
    });
  }
  // when API returns 200 but operation fails
  // (see Python API json_error_response(...))
  if ('error' in error) {
    const { error: message, ...rest } = error;
    throw new SupersetApiError({
      message,
      ...rest,
    });
  }
  // all unknown error
  throw new SupersetApiError({
    message: 'Unknown Error',
    originalError: error,
  });
}
