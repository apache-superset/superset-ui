/* eslint-disable camelcase */
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
  SupersetClientClass,
  SupersetClientInterface,
  StrictJsonValue,
  JsonValue,
} from '@superset-ui/connection';

export type ParsedResponseType<T> = T extends 'text'
  ? string
  : T extends 'raw' | null
  ? Response
  : JsonValue;

/**
 * Runtime options when calling a Superset API. Currently only allow overriding
 * SupersetClient instance.
 */
export interface SupersetApiRequestOptions {
  client?: SupersetClientInterface | SupersetClientClass;
}

/**
 * API Error json response following the format in `json_error_response(...)`
 * https://github.com/apache/incubator-superset/blob/8e23d4f369f35724b34b14def8a5a8bafb1d2ecb/superset/views/base.py#L94
 */
export interface SupersetApiErrorPayload {
  error: string; // error message returned from API
  status?: number;
  statusText?: string;
  link?: string;
}

/**
 * API error json response following FlaskAppBuilder convention. E.g.
 *  response_404(message=...) -> { "message": ... }
 */
export interface SupersetApiHttpErrorPayload {
  message: string;
  error_type?: string;
  extra?: StrictJsonValue;
  level?: 'error' | 'warn' | 'info';
}

export interface SupersetApiHttpMultiErrorsPayload {
  errors: SupersetApiHttpErrorPayload[];
}

export class SupersetApiError extends Error {
  status?: number;

  statusText?: string;

  link?: string;

  originalError?: Error | string | Response;

  constructor({
    message,
    status,
    statusText,
    link,
    stack,
    originalError,
  }: Omit<SupersetApiErrorPayload, 'error'> & {
    message: string;
    stack?: Error['stack'];
    originalError?: Error | string | Response; // original JavaScript error captured
  }) {
    super(message);
    this.name = 'SupersetApiError';
    this.stack = stack
      ? [(this.stack || '').split('\n')[0], ...stack.split('\n').slice(1)].join('\n')
      : this.stack;
    this.status = status;
    this.statusText = statusText;
    this.link = link;
    this.originalError = originalError;
  }
}

export interface ChartDataResponseResult {
  cache_key: string | null;
  cache_timeout: number | null;
  cache_dttm: string | null;
  data: Record<string, unknown>[];
  error: string | null;
  is_cached: boolean;
  query: string;
  rowcount: number;
  stacktrace: string | null;
  status: 'stopped' | 'failed' | 'pending' | 'running' | 'scheduled' | 'success' | 'timed_out';
}

export interface ChartDataResponse {
  result: ChartDataResponseResult[];
}
