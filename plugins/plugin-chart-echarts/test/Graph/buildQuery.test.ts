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
import buildQuery from '../../src/Graph/buildQuery';

describe('Graph buildQuery', () => {
  const formData = {
    datasource: '5__table',
    granularity_sqla: 'ds',
    source: 'dummy_source',
    target: 'dummy_target',
    category: null,
    metrics: ['foo', 'bar'],
    viz_type: 'my_chart',
  };

  it('should build groupby without categories', () => {
    const queryContext = buildQuery(formData);
    const [query] = queryContext.queries;
    expect(query.groupby).toEqual(['dummy_source', 'dummy_target']);
    expect(query.metrics).toEqual(['foo', 'bar']);
  });

  it('should build groupby with categories', () => {
    // @ts-ignore
    formData.category = 'dummy_category';
    const queryContext = buildQuery(formData);
    const [query] = queryContext.queries;
    expect(query.groupby).toEqual(['dummy_source', 'dummy_target', 'dummy_category']);
    expect(query.metrics).toEqual(['foo', 'bar']);
  });
});
