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
import { DatasourceType } from '@superset-ui/query';
import transformProps from '../src/plugin/transformProps';
import { HelloWorldChartPlugin } from '../src';

// TODO: add comments about how to test controls
describe('@superset-ui/plugin-chart-hello-world', () => {
  it('exists', () => {
    expect(HelloWorldChartPlugin).toBeDefined();
  });

  it('transformProps returns correct data', () => {
    const chartProps = {
      width: 10,
      height: 20,
      formData: {
        boldText: true,
        headerFontSize: 'xs',
        headerText: 'my text',
      },
      queryData: {
        abc: 123,
        qwerty: 'xyz',
      },
      annotationData: {},
      datasource: {
        id: 1,
        name: 'myDatasource',
        type: DatasourceType.Table,
        columns: [],
        metrics: [],
      },
      rawDatasource: {},
      rawFormData: {},
      initialValues: {},
      hooks: {},
    };
    const transformedProps = transformProps(chartProps);

    // Make sure correct data is returned from transformProps
    expect(transformedProps).toHaveProperty('width', 10);
    expect(transformedProps).toHaveProperty('height', 20);
    expect(transformedProps).toHaveProperty('data');
    expect(transformedProps).toHaveProperty('boldText', true);
    expect(transformedProps).toHaveProperty('headerFontSize', 'xs');
    expect(transformedProps).toHaveProperty('headerText', 'my text');
    // Make sure data that is supposed to be removed isn't returned
    expect(transformedProps).not.toHaveProperty('hooks');
    expect(transformedProps).not.toHaveProperty('annotationData');
  });
});
