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
import React, { useState } from 'react';
import { ColumnInstance, Column } from 'react-table';
import {
  FaSort,
  FaSortUp, // asc
  FaSortDown, // desc
} from 'react-icons/fa';

import { t } from '@superset-ui/translation';
import { DataRecordValue, DataRecord } from '@superset-ui/chart';

import { TableChartTransformedProps, DataType } from './types';
import DataTable from './DataTable';
import Styles from './Styles';
import formatValue from './utils/formatValue';

function SortIcon({ column }: { column: ColumnInstance }) {
  const { isSorted, isSortedDesc } = column;
  let sortIcon = <FaSort />;
  if (isSorted) {
    sortIcon = isSortedDesc ? <FaSortDown /> : <FaSortUp />;
  }
  return sortIcon;
}

/**
 * Cell background to render columns as horizontal bar chart
 */
function cellBar({
  value,
  valueRange,
  colorPositiveNegative = false,
  alignPositiveNegative,
}: {
  value: number;
  valueRange: number[];
  colorPositiveNegative: boolean;
  alignPositiveNegative: boolean;
}) {
  const [minValue, maxValue] = valueRange;
  const r = colorPositiveNegative && value < 0 ? 150 : 0;
  if (alignPositiveNegative) {
    const perc = Math.abs(Math.round((value / maxValue) * 100));
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
  const perc1 = Math.round((Math.min(negExtent + value, negExtent) / tot) * 100);
  const perc2 = Math.round((Math.abs(value) / tot) * 100);
  // The 0.01 to 0.001 is a workaround for what appears to be a
  // CSS rendering bug on flat, transparent colors
  return (
    `linear-gradient(to right, rgba(0,0,0,0.01), rgba(0,0,0,0.001) ${perc1}%, ` +
    `rgba(${r},0,0,0.2) ${perc1}%, rgba(${r},0,0,0.2) ${perc1 + perc2}%, ` +
    `rgba(0,0,0,0.01) ${perc1 + perc2}%, rgba(0,0,0,0.001) 100%)`
  );
}

export default function TableChart<D extends DataRecord = DataRecord>(
  props: TableChartTransformedProps<D>,
) {
  const {
    height,
    width,
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

  const columns = columnsMeta.map(
    (column, i): Column<D> => {
      const { key, label, dataType } = column;
      const valueRange = showCellBars && getValueRange(key);
      return {
        id: String(i), // to allow duplicate column keys
        accessor: key,
        Header: label,
        SortIcon,
        sortDescFirst: sortDesc,
        cellProps: ({ value: value_ }, cellProps) => {
          let className = '';
          const value = value_ as DataRecordValue;
          if (dataType === DataType.Number) {
            className += ' dt-metric';
          } else if (emitFilter) {
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
            cellContent: text,
            onClick: valueRange ? undefined : () => toggleFilter(key, value),
            className,
            style: {
              ...cellProps.style,
              background: valueRange
                ? cellBar({
                    value: value as number,
                    valueRange,
                    alignPositiveNegative,
                    colorPositiveNegative,
                  })
                : undefined,
            },
          };
        },
      };
    },
  );

  return (
    <Styles>
      <DataTable<D>
        columns={columns}
        data={data}
        tableClassName="table table-striped"
        showSearchInput={includeSearch}
        // make `width` and `height` state so when resizing the chart
        // does not rerender
        pageSize={pageSize}
        width={width}
        height={height}
        // 9 page items in > 340px works well even for 100+ pages
        maxPageItemCount={width > 340 ? 9 : 7}
        noResults={(filter: string) => t(filter ? 'No matching records found' : 'No records found')}
      />
    </Styles>
  );
}
