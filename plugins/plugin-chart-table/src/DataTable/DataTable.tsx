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
import React from 'react';
import { useTable, usePagination, useSortBy, useGlobalFilter, PluginHook } from 'react-table';
import { Form, Row, Col } from 'react-bootstrap';
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

function renderSortIcon<D extends object>(column: DataTableColumnInstance<D>) {
  if (column.isSorted) {
    return column.isSortedDesc ? ' 🔽' : ' 🔼';
  }
  return '';
}

// Be sure to pass our updateMyData and the skipReset option
export default function DataTable<D extends object>({
  height = 300,
  className,
  columns,
  data,
  initialState: initialState_ = {},
  pageSize: initialPageSize = 0,
  pageSizeOptions = [10, 25, 40, 50, 75, 100, 150, 200],
  showSearchInput,
  hooks,
}: DataTableProps<D>) {
  const tableHooks: PluginHook<D>[] = [useGlobalFilter, useSortBy];
  const initialState: Partial<DataTableState<D>> = { ...initialState_ };
  if (initialPageSize > 0) {
    initialState.pageSize = initialPageSize;
    tableHooks.push(usePagination);
  }
  // any additional custom hooks
  if (hooks) {
    tableHooks.push(...hooks);
  }
  const {
    getTableProps,
    getTableBodyProps,
    prepareRow,
    headerGroups,
    page,
    rows,
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

  // Render the UI for your table
  return (
    <>
      {pageSize || showSearchInput ? (
        <Form inline>
          <Row>
            {pageSize ? (
              <Col sm={6}>
                <SelectPageSize
                  sizeOptions={pageSizeOptions}
                  currentSize={pageSize}
                  onChange={setPageSize}
                />
              </Col>
            ) : null}
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
                <th {...column.getHeaderProps()} {...column.getSortByToggleProps()}>
                  {column.render('Header')}
                  {renderSortIcon<D>(column)}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {(page || rows).map(row => {
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
          })}
        </tbody>
      </table>
      {pageSize ? (
        <SimplePagination pageCount={pageCount} currentPage={pageIndex} gotoPage={gotoPage} />
      ) : null}
    </>
  );
}
