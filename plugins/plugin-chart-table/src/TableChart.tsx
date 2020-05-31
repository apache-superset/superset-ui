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
import styled from '@superset-ui/style';
import React, { useState } from 'react';
import { DataRecordValue, DataRecord } from '@superset-ui/chart';
import { filterXSS } from 'xss';
import { TimeFormatter } from '@superset-ui/time-format';
import { TableChartTransformedProps, DataColumnMeta } from './types';
import Table, { DataTableOptions, DataTableColumnCellProps } from './DataTable';

const Styles = styled.div`
  margin: 0 auto;
  table {
    width: 100%;
  }
  .dt-metric {
    text-align: right;
  }
  td.dt-is-filter {
    cursor: pointer;
  }
  td.dt-is-filter:hover {
    background-color: linen;
  }
  td.dt-is-active-filter,
  td.dt-is-active-filter:hover {
    background-color: lightcyan;
  }
  .dt-global-filter {
    float: right;
  }
  .dt-pagination {
    text-align: right;
    margin-top: 0.5em;
  }
  .pagination > li > span.dt-pagination-ellipsis:focus,
  .pagination > li > span.dt-pagination-ellipsis:hover {
    background: #fff;
  }
`;

function isProbablyHTML(text: string) {
  return /<[^>]+>/.test(text);
}

/**
 * Format text for cell value
 */
function formatValue(
  { isTime, formatter }: DataColumnMeta,
  value: DataRecordValue,
): [boolean, string] {
  if (value === null) {
    return [false, 'N/A'];
  }
  if (isTime) {
    let time = value;
    if (typeof time === 'string') {
      // force UTC time zone if is an ISO timestamp without timezone
      // e.g. "2020-10-12T00:00:00"
      time = time.match(/T(\d{2}:){2}\d{2}$/) ? `${time}Z` : time;
      time = new Date(time);
    }
    return [false, (formatter as TimeFormatter)(time as Date | number | null) as string];
  }
  if (formatter) {
    // in case percent metric can specify percent format in the future
    return [false, formatter(value as number)];
  }
  if (typeof value === 'string') {
    const htmlText = filterXSS(value, { stripIgnoreTag: true });
    return isProbablyHTML(htmlText) ? [true, htmlText] : [false, value];
  }
  return [false, value.toString()];
}

export default function TableChart(props: TableChartTransformedProps) {
  const {
    height,
    data,
    columns: columnsMeta,
    alignPositiveNegative = false,
    colorPositiveNegative = false,
    includeSearch = false,
    pageSize = 0,
    showCellBars = true,
    emitFilter = false,
    sortDesc = false,
    onChangeFilter = () => {},
    filters: initialFilters = {},
  } = props;

  const [filters, setFilters] = useState(initialFilters);

  function getValueRange(key: string) {
    let maxValue;
    let minValue;
    if (typeof data?.[0]?.[key] === 'number') {
      const nums = data.map(row => row[key]) as number[];
      if (alignPositiveNegative) {
        maxValue = Math.max(...nums.map(Math.abs));
        minValue = 0;
      } else {
        maxValue = Math.max(...nums);
        minValue = Math.min(...nums);
      }
      return [minValue, maxValue];
    }
    return null;
  }

  /**
   * Cell background to render columns as horizontal bar chart
   */
  function cellBar(val: number, valueRange: number[]) {
    const [minValue, maxValue] = valueRange;
    const r = colorPositiveNegative && val < 0 ? 150 : 0;
    if (alignPositiveNegative) {
      const perc = Math.abs(Math.round((val / maxValue) * 100));
      // The 0.01 to 0.001 is a workaround for what appears to be a
      // CSS rendering bug on flat, transparent colors
      return (
        `linear-gradient(to right, rgba(${r},0,0,0.2), rgba(${r},0,0,0.2) ${perc}%, ` +
        `rgba(0,0,0,0.01) ${perc}%, rgba(0,0,0,0.001) 100%)`
      );
    }
    const posExtent = Math.abs(Math.max(maxValue, 0));
    const negExtent = Math.abs(Math.min(minValue, 0));
    const tot = posExtent + negExtent;
    const perc1 = Math.round((Math.min(negExtent + val, negExtent) / tot) * 100);
    const perc2 = Math.round((Math.abs(val) / tot) * 100);
    // The 0.01 to 0.001 is a workaround for what appears to be a
    // CSS rendering bug on flat, transparent colors
    return (
      `linear-gradient(to right, rgba(0,0,0,0.01), rgba(0,0,0,0.001) ${perc1}%, ` +
      `rgba(${r},0,0,0.2) ${perc1}%, rgba(${r},0,0,0.2) ${perc1 + perc2}%, ` +
      `rgba(0,0,0,0.01) ${perc1 + perc2}%, rgba(0,0,0,0.001) 100%)`
    );
  }

  function isActiveFilterValue(key: string, val: DataRecordValue) {
    return filters[key]?.includes(val);
  }

  function toggleFilter(key: string, val: DataRecordValue) {
    const updatedFilters = { ...filters };
    if (isActiveFilterValue(key, val)) {
      updatedFilters[key] = filters[key].filter((x: DataRecordValue) => x !== val);
    } else {
      updatedFilters[key] = [...(filters[key] || []), val];
    }
    setFilters(updatedFilters);
    onChangeFilter(updatedFilters);
  }

  const columns: DataTableOptions<DataRecord>['columns'] = columnsMeta.map((column, i) => {
    const { key, label, isMetric, isPercentMetric } = column;
    const valueRange = showCellBars && getValueRange(key);
    return {
      id: String(i), // to allow duplicate column keys
      accessor: key,
      Header: label,
      sortDescFirst: sortDesc,
      cellProps: (({ value }) => {
        let className = '';
        if (isMetric) {
          className += ' dt-metric';
        } else if (!isMetric && !isPercentMetric && emitFilter) {
          className += ' dt-is-filter';
          if (isActiveFilterValue(key, value)) {
            className += ' dt-is-active-filter';
          }
        }
        const [isHtml, text] = formatValue(column, value);
        return {
          // show raw number in title in case of numeric values
          title: typeof value === 'number' ? String(value) : undefined,
          dangerouslySetInnerHTML: isHtml ? { __html: text } : undefined,
          textContent: text,
          onClick: valueRange ? undefined : () => toggleFilter(key, value),
          className,
          style: {
            background: valueRange ? cellBar(value, valueRange) : undefined,
          },
        };
      }) as DataTableColumnCellProps<DataRecord, number>,
    };
  });

  return (
    <Styles>
      <Table
        className="table table-striped"
        columns={columns}
        height={height}
        data={data}
        showSearchInput={includeSearch}
        pageSize={pageSize}
      />
    </Styles>
  );
}
