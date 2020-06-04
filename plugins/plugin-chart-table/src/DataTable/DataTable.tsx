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
import React, { useEffect, useCallback, createRef } from 'react';
import { t } from '@superset-ui/translation';
import {
  useTable,
  usePagination,
  useSortBy,
  useGlobalFilter,
  PluginHook,
  TableCellProps,
  TableOptions,
} from 'react-table';
import { Row, Col } from 'react-bootstrap';
import {
  FaSort,
  FaSortUp, // asc
  FaSortDown, // desc
} from 'react-icons/fa';
import GlobalFilter from './components/GlobalFilter';
import SelectPageSize from './components/SelectPageSize';
import SimplePagination from './components/Pagination';
import Styles from './Styles';
import useSticky from './hooks/useSticky';
import useColumnCellProps from './hooks/useColumnCellProps';

export interface DataTableProps<D extends object>
  extends Omit<TableOptions<D>, 'getStickyTableSize'> {
  className?: string;
  showSearchInput?: boolean;
  pageSizeOptions?: number[]; // available page size options
  hooks?: PluginHook<D>[]; // any additional hooks
  width?: string | number;
  height?: string | number;
  pageSize?: number;
}

export interface RenderHTMLCellProps extends React.HTMLProps<HTMLTableCellElement> {
  cellContent: React.ReactNode;
}

// Be sure to pass our updateMyData and the skipReset option
export default function DataTable<D extends object>({
  className,
  columns,
  data,
  width: initialWidth = '100%',
  height: initialHeight = 300,
  pageSize: initialPageSize = 0,
  initialState: initialState_ = {},
  pageSizeOptions = [10, 25, 40, 50, 75, 100, 150, 200],
  showSearchInput,
  hooks,
}: DataTableProps<D>) {
  const tableHooks: PluginHook<D>[] = [
    useGlobalFilter,
    useSortBy,
    usePagination,
    useSticky,
    useColumnCellProps,
    ...(hooks || []),
  ];
  const initialState = { ...initialState_ };
  const hasPagination = initialPageSize > 0; // pageSize == 0 means no pagination
  if (!hasPagination) {
    // we need to hack pagination to data size for the `usePagination` plugin
    initialState.pageSize = data.length;
  }

  const wrapperRef: React.Ref<HTMLDivElement> = createRef();
  const tableRef: React.Ref<HTMLTableElement> = createRef();
  const globalControlRef: React.Ref<HTMLDivElement> = createRef();
  const paginationRef: React.Ref<HTMLDivElement> = createRef();

  const {
    getTableProps,
    getTableBodyProps,
    prepareRow,
    headerGroups,
    page,
    pageCount,
    gotoPage,
    preGlobalFilteredRows,
    setGlobalFilter,
    setPageSize,
    updateStickyTableSize,
    state: { pageIndex, pageSize, globalFilter, tableWidth, tableHeight },
  } = useTable<D>(
    {
      columns,
      data,
      initialState,
      getStickyTableSize: useCallback(() => {
        if (wrapperRef.current && tableRef.current) {
          const width = tableRef.current.clientWidth;
          const height =
            wrapperRef.current.clientHeight -
            (globalControlRef.current?.clientHeight || 0) -
            (paginationRef.current?.clientHeight || 0);
          return { tableWidth: width, tableHeight: height };
        }
        return null;
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [initialHeight, initialWidth]),
    },
    ...tableHooks,
  );

  const hasGlobalControl = hasPagination || showSearchInput;

  // force upate the pageSize when it's been update from the initial state
  useEffect(() => {
    if (setPageSize) {
      setPageSize(initialPageSize);
    }
  }, [initialPageSize, setPageSize]);

  useEffect(() => {
    if (updateStickyTableSize) {
      updateStickyTableSize();
    }
  }, [initialHeight, updateStickyTableSize]);

  return (
    <Styles ref={wrapperRef} style={{ width: initialWidth, height: initialHeight }}>
      {hasGlobalControl ? (
        <div ref={globalControlRef} className="form-inline dt-controls">
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
        </div>
      ) : null}
      <div style={{ height: tableHeight, overflow: 'auto' }}>
        <table ref={tableRef} {...getTableProps({ className })}>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => {
                  const headerProps = column.getHeaderProps();
                  const sortByProps = column.getSortByToggleProps();
                  const props = {
                    ...headerProps,
                    ...sortByProps,
                    style: {
                      ...headerProps.style,
                      ...sortByProps.style,
                    },
                  };
                  props.className = column.isSorted
                    ? `${props.className} is-sorted`
                    : props.className;

                  let sortIcon = <FaSort />;
                  if (column.isSorted) {
                    sortIcon = column.isSortedDesc ? <FaSortDown /> : <FaSortUp />;
                  }

                  return (
                    <th key={column.id} {...props}>
                      {column.render('Header')}
                      {sortIcon}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page && page.length > 0 ? (
              page.map(row => {
                prepareRow(row);
                return (
                  <tr key={row.id} {...row.getRowProps()}>
                    {row.cells.map(cell => {
                      const key = cell.column.id;
                      const cellProps = cell.getCellProps() as TableCellProps & RenderHTMLCellProps;
                      const { cellContent, ...restProps } = cellProps;
                      if (cellProps.dangerouslySetInnerHTML) {
                        return <td key={key} {...restProps} />;
                      }
                      // If cellProps renderes textContent already, then we don't have to
                      // render `Cell`. This saves some time for large tables.
                      return (
                        <td key={key} {...restProps}>
                          {cellContent || cell.render('Cell')}
                        </td>
                      );
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
      </div>
      {hasPagination ? (
        <SimplePagination
          ref={paginationRef}
          maxPageItemCount={(tableWidth || initialWidth) > 300 ? 9 : 7}
          pageCount={pageCount}
          currentPage={pageIndex}
          onPageChange={gotoPage}
        />
      ) : null}
    </Styles>
  );
}
