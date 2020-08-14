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
import { getNumberFormatter, NumberFormats } from '@superset-ui/number-format';
import {
  extractForecastSeriesContext,
  extractProphetValuesFromTooltipParams,
  extractSeriesBase,
  extractTimeseriesSeries,
  formatProphetTooltipSeries,
  rebaseTimeseriesDatum,
} from '../src/utils';
import { ForecastSeriesEnum } from '../src/types';

describe('extractTimeseriesSeries', () => {
  it('should generate a valid ECharts timeseries series object', () => {
    const data = [
      {
        __timestamp: '2000-01-01',
        Hulk: null,
        abc: 2,
      },
      {
        __timestamp: '2000-02-01',
        Hulk: 2,
        abc: 10,
      },
      {
        __timestamp: '2000-03-01',
        Hulk: 1,
        abc: 5,
      },
    ];
    expect(extractTimeseriesSeries(data)).toEqual([
      {
        name: 'Hulk',
        data: [
          [new Date('2000-01-01'), null],
          [new Date('2000-02-01'), 2],
          [new Date('2000-03-01'), 1],
        ],
      },
      {
        name: 'abc',
        data: [
          [new Date('2000-01-01'), 2],
          [new Date('2000-02-01'), 10],
          [new Date('2000-03-01'), 5],
        ],
      },
    ]);
  });
});

describe('extractSeriesBase', () => {
  it('should find minimum value for a valid ECharts series', () => {
    const series: echarts.EChartOption.Series[] = [
      {
        name: 'abc',
        data: [
          [1, undefined],
          [2, 10],
          [3, -1],
        ],
      },
      {
        name: 'qwerty',
        data: [
          [1, 100],
          [2, 0],
          [3, -2],
        ],
      },
    ];
    expect(extractSeriesBase(series)).toEqual(-2);
  });
});

describe('extractForecastSeriesContext', () => {
  it('should extract the correct series name and type', () => {
    expect(extractForecastSeriesContext('abcd')).toEqual({
      name: 'abcd',
      type: ForecastSeriesEnum.Observation,
    });
    expect(extractForecastSeriesContext('qwerty__yhat')).toEqual({
      name: 'qwerty',
      type: ForecastSeriesEnum.ForecastTrend,
    });
    expect(extractForecastSeriesContext('X Y Z___yhat_upper')).toEqual({
      name: 'X Y Z_',
      type: ForecastSeriesEnum.ForecastUpper,
    });
    expect(extractForecastSeriesContext('1 2 3__yhat_lower')).toEqual({
      name: '1 2 3',
      type: ForecastSeriesEnum.ForecastLower,
    });
  });
});

describe('rebaseTimeseriesDatum', () => {
  it('should subtract lower confidence level from upper value', () => {
    expect(
      rebaseTimeseriesDatum([
        {
          __timestamp: new Date('2001-01-01'),
          abc: 10,
          abc__yhat_lower: 1,
          abc__yhat_upper: 20,
        },
        {
          __timestamp: new Date('2002-01-01'),
          abc: 10,
          abc__yhat_lower: null,
          abc__yhat_upper: 20,
        },
        {
          __timestamp: new Date('2003-01-01'),
          abc: 10,
          abc__yhat_lower: 1,
          abc__yhat_upper: null,
        },
      ]),
    ).toEqual([
      {
        __timestamp: new Date('2001-01-01'),
        abc: 10,
        abc__yhat_lower: 1,
        abc__yhat_upper: 19,
      },
      {
        __timestamp: new Date('2002-01-01'),
        abc: 10,
        abc__yhat_lower: null,
        abc__yhat_upper: 20,
      },
      {
        __timestamp: new Date('2003-01-01'),
        abc: 10,
        abc__yhat_lower: 1,
        abc__yhat_upper: null,
      },
    ]);
  });
});

describe('extractProphetValuesFromTooltipParams', () => {
  it('should extract the proper data from tooltip params', () => {
    expect(
      extractProphetValuesFromTooltipParams([
        {
          seriesId: 'abc',
          value: [new Date(0), 10],
        },
        {
          seriesId: 'abc__yhat',
          value: [new Date(0), 1],
        },
        {
          seriesId: 'abc__yhat_lower',
          value: [new Date(0), 5],
        },
        {
          seriesId: 'abc__yhat_upper',
          value: [new Date(0), 6],
        },
        {
          seriesId: 'qwerty',
          value: [new Date(0), 2],
        },
      ]),
    ).toEqual({
      abc: {
        observation: 10,
        forecastTrend: 1,
        forecastLower: 5,
        forecastUpper: 6,
      },
      qwerty: {
        observation: 2,
      },
    });
  });
});

const formatter = getNumberFormatter(NumberFormats.INTEGER);

describe('formatProphetTooltipSeries', () => {
  it('should generate a proper series tooltip', () => {
    expect(
      formatProphetTooltipSeries({
        seriesName: 'abc',
        marker: '<img>',
        observation: 10,
        formatter,
      }),
    ).toEqual('<img>abc: x10');
    expect(
      formatProphetTooltipSeries({
        seriesName: 'qwerty',
        marker: '<img>',
        observation: 10,
        forecastTrend: 20,
        forecastLower: 5,
        forecastUpper: 7,
        formatter,
      }),
    ).toEqual('<img>qwerty: x10, ŷ = x20 (x5, x12)');
    expect(
      formatProphetTooltipSeries({
        seriesName: 'qwerty',
        marker: '<img>',
        forecastTrend: 20,
        forecastLower: 5,
        forecastUpper: 7,
        formatter,
      }),
    ).toEqual('<img>qwerty: ŷ = x20 (x5, x12)');
  });
});