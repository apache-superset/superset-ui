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
import { convertUTCTS, getUTC } from '../src/utils';

describe('legacy-plugin-chart-calendar/utils', () => {
  const timezone = new Date().getTimezoneOffset() / 60;
  const date = new Date(2020, 2, 2, 2, 2);

  it('convertUTCTS', () => {
    const converted = convertUTCTS(date.getTime());

    const diffInMilliSeconds = Math.abs(converted - date.getTime()) / 1000;
    const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
    expect(Math.abs(timezone)).toBe(hours);
  });

  it('getUTC', () => {
    const converted = getUTC(date);

    const diffInMilliSeconds = Math.abs(converted - date) / 1000;
    const hours = Math.floor(diffInMilliSeconds / 3600) % 24;

    expect(Math.abs(timezone)).toBe(hours);
  });
});
