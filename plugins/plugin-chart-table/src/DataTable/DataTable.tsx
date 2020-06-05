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
import React, {
  useEffect,
  useCallback,
  useRef,
  useLayoutEffect,
  ReactNode,
  HTMLProps,
} from 'react';
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
import GlobalFilter from './components/GlobalFilter';
import SelectPageSize from './components/SelectPageSize';
import SimplePagination from './components/Pagination';
import useSticky from './hooks/useSticky';
import useColumnCellProps from './hooks/useColumnCellProps';

export interface DataTableProps<D extends object> extends Omit<TableOptions<D>, 'getTableSize'> {
  tableClassName?: string;
  showSearchInput?: boolean;
  pageSizeOptions?: number[]; // available page size options
  maxPageItemCount?: number;
  hooks?: PluginHook<D>[]; // any additional hooks
  width?: string | number;
  height?: string | number;
  pageSize?: number;
  noResults?: string | ((filterString: string) => ReactNode);
}

export interface RenderHTMLCellProps extends HTMLProps<HTMLTableCellElement> {
  cellContent: ReactNode;
}

// Be sure to pass our updateMyData and the skipReset option
export default function DataTable<D extends object>({
  tableClassName,
  columns,
  data,
  width: initialWidth = '100%',
  height: initialHeight = 300,
  pageSize: initialPageSize = 0,
  initialState: initialState_ = {},
  pageSizeOptions = [10, 25, 40, 50, 75, 100, 150, 200],
  maxPageItemCount = 9,
  showSearchInput,
  noResults = 'No data found',
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

  const hasPagination = initialPageSize > 0; // pageSize == 0 means no pagination
  const hasGlobalControl = hasPagination || showSearchInput;
  const initialState = {
    ...initialState_,
    // zero length means all pages, the `usePagination` plugin does not
    // understand pageSize = 0
    pageSize: hasPagination ? initialPageSize : data.length,
    sticky: {
      width: Number(initialWidth),
      height: Number(initialHeight),
    },
  };

  const wrapperRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLTableElement>(null);
  const globalControlRef = useRef<HTMLDivElement>(null);
  const paginationRef = useRef<HTMLDivElement>(null);

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
    setStickyElementSize,
    StickyWrap,
    state: { pageIndex, pageSize, globalFilter },
  } = useTable<D>(
    {
      columns,
      data,
      initialState,
      getTableSize: useCallback(() => {
        if (wrapperRef.current) {
          const width = wrapperRef.current.clientWidth;
          const height =
            wrapperRef.current.clientHeight -
            (globalControlRef.current?.clientHeight || 0) -
            (paginationRef.current?.clientHeight || 0);
          return { width, height };
        }
        return undefined;
      }, []),
    },
    ...tableHooks,
  );

  // force upate the pageSize when it's been update from the initial state
  useEffect(() => {
    // initialPageSize maybe zero, which means all records in data
    setPageSize(initialState.pageSize);
  }, [initialState.pageSize, setPageSize]);

  // use layout effect so element sizes are updated immediately and
  // there will not be a flash
  useLayoutEffect(() => {
    setStickyElementSize();
  }, [columns, initialWidth, initialHeight, setStickyElementSize]);

  return (
    <div ref={wrapperRef} style={{ width: initialWidth, height: initialHeight }}>
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
      <StickyWrap>
        <table ref={tableRef} {...getTableProps({ className: tableClassName })}>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => {
                  const props = column.getHeaderProps(column.getSortByToggleProps());
                  props.className = column.isSorted
                    ? `${props.className} is-sorted`
                    : props.className;
                  return (
                    <th key={column.id} {...props}>
                      {column.render('Header')}
                      {column.render('SortIcon')}
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
                  {typeof noResults === 'function' ? noResults(globalFilter as string) : noResults}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </StickyWrap>
      {hasPagination ? (
        <SimplePagination
          ref={paginationRef}
          maxPageItemCount={maxPageItemCount}
          pageCount={pageCount}
          currentPage={pageIndex}
          onPageChange={gotoPage}
        />
      ) : null}
    </div>
  );
}
