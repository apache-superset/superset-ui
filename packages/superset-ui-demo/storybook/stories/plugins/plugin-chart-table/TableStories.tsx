import React from 'react';
import { withKnobs, number, boolean } from '@storybook/addon-knobs';
import { SuperChart } from '@superset-ui/chart';
import TableChartPlugin, { TableChartProps } from '@superset-ui/plugin-chart-table';
import { basicData, birthNames } from './testData';
import { withResizableChartDemo } from '../../../shared/components/ResizableChartDemo';

export default {
  title: 'Legacy Chart Plugins|legacy-plugin-chart-table',
  decorators: [withKnobs, withResizableChartDemo],
};

new TableChartPlugin().configure({ key: 'table' }).register();

function expandArray<T>(input: T[], targetSize: number) {
  if (!input || input.length === 0) {
    throw new Error('Cannot expand an empty array');
  }
  let arr = input;
  while (arr.length < targetSize) {
    arr = arr.concat(arr);
  }
  return arr.slice(0, targetSize);
}

/**
 * Load sample data for testing
 * @param props the original props passed to SuperChart
 * @param pageLength number of records perpage
 * @param targetSize the target total number of records
 */
function loadData(
  props: TableChartProps,
  { pageLength = 50, rows = 1042, cols = 8, alignPn = false },
): TableChartProps {
  if (!props.queryData) return props;
  const records = [...(props.queryData?.data?.records || [])];
  const columns = [...(props.queryData?.data?.columns || [])];
  return {
    ...props,
    queryData: {
      ...props.queryData,
      data: {
        records: expandArray(records, rows),
        columns: expandArray(columns, cols),
      },
    },
    formData: {
      ...props.formData,
      alignPn,
      pageLength,
    },
    height: window.innerHeight - 130,
  };
}

export const basic = ({ width, height }) => (
  <SuperChart
    chartType="table"
    datasource={{
      columnFormats: {},
    }}
    width={width}
    height={height}
    queryData={{ data: basicData }}
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

export const BigTable = ({ width, height }) => {
  const rows = number('Records', 2046, { range: true, min: 0, max: 50000 });
  const cols = number('Columns', 8, { range: true, min: 1, max: 20 });
  const pageLength = number('Page size', 50, { range: true, min: 0, max: 100 });
  const alignPn = boolean('Algin PosNeg', false);
  const chartProps = React.useMemo(
    () => loadData(birthNames, { pageLength, rows, cols, alignPn }),
    [pageLength, rows, cols, alignPn],
  );
  return <SuperChart chartType="table" {...chartProps} width={width} height={height} />;
};
BigTable.story = {
  parameters: {
    initialSize: {
      width: 620,
      height: 420,
    },
  },
};
