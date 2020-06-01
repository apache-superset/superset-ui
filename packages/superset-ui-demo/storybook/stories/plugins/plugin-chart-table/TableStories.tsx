import React from 'react';
import { withKnobs, number } from '@storybook/addon-knobs';
import { SuperChart } from '@superset-ui/chart';
import TableChartPlugin, { TableChartProps } from '@superset-ui/plugin-chart-table';
import data, { birthNames } from './data';
import { withResizableChartDemo } from '../../../shared/components/ResizableChartDemo';

export default {
  title: 'Legacy Chart Plugins|legacy-plugin-chart-table',
  decorators: [withKnobs, withResizableChartDemo],
};

new TableChartPlugin().configure({ key: 'table' }).register();

function paginated(props_: TableChartProps, pageSize = 50): TableChartProps {
  const props: TableChartProps = { ...props_ };
  if (props.formData) {
    props.formData = {
      ...props.formData,
      page_length: pageSize,
    };
  }
  // eslint-disable-next-line camelcase
  if (props.queryData?.form_data) {
    props.queryData.form_data = {
      ...props.queryData.form_data,
      page_length: pageSize,
    };
  }
  return props;
}

function adjustNumCols(props: TableChartProps, numCols = 7): TableChartProps {
  const newProps = { ...props };
  if (props?.queryData.data) {
    const { columns, records } = props.queryData.data;
    const curSize = columns.length;
    const newColumns = [...new Array(numCols)].map((_, i) => {
      return columns[i % curSize];
    });
    newProps.queryData = {
      ...props.queryData,
      data: {
        records,
        columns: newColumns,
      },
    };
  }
  return newProps;
}

/**
 * Load sample data for testing
 * @param props the original props passed to SuperChart
 * @param pageSize number of records perpage
 * @param targetSize the target total number of records
 */
function loadData(props: TableChartProps, pageSize = 50, targetSize = 1042): TableChartProps {
  if (!props.queryData) return props;
  const dat = props.queryData?.data;
  if (dat && dat.records.length > 0) {
    while (dat.records.length < targetSize) {
      const { records } = dat;
      dat.records = records.concat(records);
    }
    dat.records = dat.records.slice(0, targetSize);
  }
  return paginated({ ...props, height: window.innerHeight - 130 }, pageSize);
}

export const basic = ({ width, height }) => (
  <SuperChart
    chartType="table"
    datasource={{
      columnFormats: {},
    }}
    width={width}
    height={height}
    queryData={{ data }}
    formData={{
      alignPn: false,
      colorPn: false,
      includeSearch: false,
      metrics: ['sum__num'],
      orderDesc: true,
      pageLength: 0,
      percentMetrics: null,
      showCellBars: true,
      tableFilter: false,
      tableTimestampFormat: '%Y-%m-%d %H:%M:%S',
      timeseriesLimitMetric: null,
    }}
  />
);
basic.story = {
  parameters: {
    initialSize: {
      width: 680,
      height: 420,
    },
  },
};

export const bigTable = ({ width, height }) => {
  const initialProps = loadData(birthNames);
  const numCols = number('Num columns', 5, { range: true, min: 1, max: 11 });
  const pageSize = number('Page size', 10, { range: true, min: 0, max: 100 });
  const chartProps = adjustNumCols(paginated(initialProps, pageSize), numCols);

  return <SuperChart chartType="table" width={width} height={height} {...chartProps} />;
};
bigTable.story = {
  parameters: {
    initialSize: {
      width: 680,
      height: 420,
    },
  },
};
