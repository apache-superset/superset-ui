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
export type GroupObject = {
  timestamp: number;
  value: number | string;
};

export type Period = 'min' | 'hour' | 'day' | 'week' | 'month' | 'year';

export function groupByTimePeriod(
  obj: GroupObject[],
  column: string,
  period: Period,
): Record<string, GroupObject[]> {
  const objPeriod: Record<string, GroupObject[]> = {};

  const getKey = function (d: Date): number {
    switch (period) {
      case 'min':
        return Math.floor(d.getTime() / (1000 * 60));
      case 'hour':
        return Math.floor(d.getTime() / (1000 * 60 * 60));
      case 'day':
        return Math.floor(d.getTime() / (1000 * 60 * 60 * 24));
      case 'week':
        return Math.floor(d.getTime() / (1000 * 60 * 60 * 24 * 7));
      case 'month':
        return (d.getFullYear() - 1970) * 12 + d.getMonth();
      case 'year':
        return d.getFullYear();
      default:
        return d.getTime();
    }
  };

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < obj.length; i++) {
    // @ts-ignore
    const d = new Date(obj[i][column] * 1000);
    const key = getKey(d);
    objPeriod[key] = objPeriod[key] || [];
    objPeriod[key].push(obj[i]);
  }

  return objPeriod;
}
