/* eslint-disable react/jsx-key */
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
import React, { useEffect } from 'react';
import { t } from '@superset-ui/translation';
import { useTable, usePagination, useSortBy, useGlobalFilter, PluginHook } from 'react-table';
import { Form, Row, Col } from 'react-bootstrap';
import {
  FaSort,
  FaSortUp, // asc
  FaSortDown, // desc
} from 'react-icons/fa';
import {
  DataTableProps,
  DataTableCellProps,
  DataTableInstance,
  DataTableColumnInstance,
  DataTableState,
} from './types';
import GlobalFilter from './components/GlobalFilter';
import SelectPageSize from './components/SelectPageSize';
import SimplePagination from './components/Pagination';
import Styles from './Styles';

function renderSortIcon<D extends object>(column: DataTableColumnInstance<D>) {
  if (column.isSorted) {
    return column.isSortedDesc ? <FaSortDown /> : <FaSortUp />;
  }
  return <FaSort />;
}

// Be sure to pass our updateMyData and the skipReset option
export default function DataTable<D extends object>({
  height = 300,
  className,
  columns,
  data,
  initialState: initialState_ = {},
  pageSizeOptions = [10, 25, 40, 50, 75, 100, 150, 200],
  showSearchInput,
  hooks,
}: DataTableProps<D>) {
  const tableHooks: PluginHook<D>[] = [useGlobalFilter, useSortBy, usePagination, ...(hooks || [])];
  const initialState = { pageSize: 0, ...initialState_ };
  const hasPagination = initialState.pageSize > 0;
  if (!hasPagination) {
    initialState.pageSize = data.length;
  }
  const {
    getTableProps,
    getTableBodyProps,
    prepareRow,
    headerGroups,
    page,
    pageCount,
    gotoPage,
    setPageSize,
    preGlobalFilteredRows,
    setGlobalFilter,
    state: { pageIndex, pageSize, globalFilter },
  } = useTable<D>(
    {
      columns,
      data,
      initialState,
    },
    ...tableHooks,
  ) as DataTableInstance<D>;

  // force upate the pageSize when it's been update from the initial state
  useEffect(() => {
    if (setPageSize) {
      setPageSize(initialState.pageSize);
    }
  }, [initialState.pageSize, setPageSize]);

  // Render the UI for your table
  return (
    <Styles>
      {hasPagination || showSearchInput ? (
        <Form inline>
          <Row>
            <Col sm={6}>
              {hasPagination ? (
                <SelectPageSize
                  sizeOptions={pageSizeOptions}
                  currentSize={pageSize}
                  onChange={setPageSize}
                />
              ) : null}
            </Col>
            {showSearchInput ? (
              <Col sm={6}>
                <GlobalFilter<D>
                  preGlobalFilteredRows={preGlobalFilteredRows}
                  setGlobalFilter={setGlobalFilter}
                  globalFilter={globalFilter}
                />
              </Col>
            ) : null}
          </Row>
        </Form>
      ) : null}
      <table {...getTableProps({ className })}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th
                  {...column.getHeaderProps()}
                  {...column.getSortByToggleProps({
                    className: column.isSorted ? 'is-sorted' : undefined,
                  })}
                >
                  {column.render('Header')}
                  {renderSortIcon<D>(column)}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page && page.length > 0 ? (
            page.map(row => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    const cellProps: DataTableCellProps = cell.getCellProps();
                    if (cell.column.cellProps) {
                      Object.assign(cellProps, cell.column.cellProps(cell) || {});
                    }
                    const { textContent, ...restProps } = cellProps;
                    if (cellProps.dangerouslySetInnerHTML) {
                      return <td {...restProps} />;
                    }
                    // If cellProps renderes textContent already, then we don't have to
                    // render `Cell`. This saves some time for large tables.
                    return <td {...restProps}>{textContent || cell.render('Cell')}</td>;
                  })}
                </tr>
              );
            })
          ) : (
            <tr>
              <td className="dt-no-results" colSpan={columns.length}>
                {t(globalFilter ? 'No matching records found' : 'No records found')}
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {hasPagination ? (
        <SimplePagination pageCount={pageCount} currentPage={pageIndex} gotoPage={gotoPage} />
      ) : null}
    </Styles>
  );
}
