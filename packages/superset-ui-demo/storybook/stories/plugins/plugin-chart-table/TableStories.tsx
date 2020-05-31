import React, { useState } from 'react';
import { SuperChart } from '@superset-ui/chart';
import TableChartPlugin from '@superset-ui/legacy-plugin-chart-table';
import { SupersetBody } from '../../../shared/components/ResizableChartDemo';
import TableChartPlugin, { TableChartProps } from '@superset-ui/plugin-chart-table';
import data, { birthNames } from './data';
import 'bootstrap/dist/css/bootstrap.min.css';

new TableChartPlugin().configure({ key: 'table' }).register();

function paginated(props_: TableChartProps, pageSize = 50) {
  const props: TableChartProps = { ...props_ };
  if (props.formData) {
    props.formData = {
      ...props.formData,
      pageLength: pageSize,
      page_length: pageSize,
    };
  }
  // eslint-disable-next-line camelcase
  if (props.queryData?.form_data) {
    props.queryData.form_data = {
      ...props.queryData.form_data,
      pageLength: pageSize,
      page_length: pageSize,
    };
  }
  return {
    ...props,
  };
}

function adjustNumCols(props: TableChartProps, numCols = 7) {
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
function loadData(props: TableChartProps, pageSize = 50, targetSize = 10042) {
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

export default {
  title: 'Legacy Chart Plugins|legacy-plugin-chart-table',
};

export const Basic = () => (
  <SuperChart
    chartType="table"
    width={400}
    height={400}
    datasource={{
      columnFormats: {},
      verboseMap: {
        name: 'name',
        sum__num: 'sum__num',
      },
    }}
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

export const BigTable = () => {
  const initialProps = loadData(birthNames);
  const [chartProps, setChartProps] = useState(initialProps);

  const updatePageSize = (size: number) => {
    setChartProps(paginated(initialProps, size));
  };
  const updateNumCols = (numCols: number) => {
    setChartProps(adjustNumCols(initialProps, numCols));
  };

  return (
    <SupersetBody>
      <div className="panel">
        <div className="panel-heading form-inline">
          <div className="form-group">
            Initial page size:{' '}
            <div className="btn-group btn-group-sm">
              {[10, 25, 40, 50, 100, -1].map(pageSize => {
                return (
                  <button
                    key={pageSize}
                    type="button"
                    className="btn btn-default"
                    onClick={() => updatePageSize(pageSize)}
                  >
                    {pageSize > 0 ? pageSize : 'All'}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="form-group" style={{ marginLeft: 20 }}>
            Number of columns:{' '}
            <div className="btn-group btn-group-sm">
              {[1, 3, 5, 7, 9].map(numCols => {
                return (
                  <button
                    key={numCols}
                    type="button"
                    className="btn btn-default"
                    onClick={() => updateNumCols(numCols)}
                  >
                    {numCols}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <div className="panel-body">
          <SuperChart {...chartProps} chartType="table" />
        </div>
      </div>
    </SupersetBody>
  );
};
