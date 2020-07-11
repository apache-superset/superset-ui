/* eslint-disable no-magic-numbers */
import React from 'react';
import { SuperChart } from '@superset-ui/chart';
import TimeTableChartPlugin from '@superset-ui/legacy-plugin-chart-time-table';
import data from './data';

new TimeTableChartPlugin().configure({ key: 'time-table' }).register();

export default {
  title: 'Legacy Chart Plugins|legacy-plugin-chart-time-table',
};

export const basic = () => {
  console.log('basic', data);
  console.log('basic timetabe', TimeTableChartPlugin);
  return (
    <SuperChart
      chartType="time-table"
      width={400}
      height={400}
      queryData={{
        data: {
          columns: [
            'East Asia & Pacific',
            'Latin America & Caribbean',
            'Middle East & North Africa',
            'Sub-Saharan Africa',
          ],
          records: data,
        },
      }}
      formData={{
        adhocFilters: [],
        groupby: ['region'],
        metrics: [
          {
            aggregate: 'MAX',
            column: {
              column_name: 'SH_IMM_IBCG',
              description: null,
              expression: null,
              filterable: true,
              groupby: true,
              id: 70,
              is_dttm: false,
              python_date_format: null,
              type: 'DOUBLE PRECISION',
              verbose_name: null,
            },
            //expressionType: "SIMPLE",
            //hasCustomLabel: false,
            //isNew: false,
            //label: "MAX(SH_IMM_IBCG)",
            //optionName: "metric_djs3a860ui8_f0bnzlypeps",
            //sqlExpression: null
          },
        ],
        granularitySqla: 'year',
        columnCollection: [
          {
            bounds: [null, null],
            colType: 'spark',
            comparisonType: '',
            d3format: '',
            dateFormat: '',
            height: '',
            key: '0vFMepUDf',
            label: 'Time Series Columns',
            showYAxis: false,
            timeLag: 0,
            timeRatio: '',
            tooltip: '',
            width: '',
            yAxisBounds: [null, null],
          },
        ],
        limit: 5,
        datasource: '2_table',
        timeGrainSqla: 'PID',
        timeRangeEndPoints: ['uknown', 'inclusive'],
        timeRange: 'No filter',
        queryFields: { metrics: 'metrics', groupby: 'groupby' },
        vizType: 'time-table',
      }}
    />
  );
};
