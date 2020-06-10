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
import React, { useState, useCallback, useRef, ReactNode, HTMLProps } from 'react';
import {
  useTable,
  usePagination,
  useSortBy,
  useGlobalFilter,
  PluginHook,
  TableCellProps,
  TableOptions,
  useMountedLayoutEffect,
  FilterType,
  IdType,
  Row,
} from 'react-table';
import matchSorter from 'match-sorter';
import GlobalFilter from './components/GlobalFilter';
import SelectPageSize, { SizeOption } from './components/SelectPageSize';
import SimplePagination from './components/Pagination';
import useSticky from './hooks/useSticky';
import useColumnCellProps from './hooks/useColumnCellProps';

export interface DataTableProps<D extends object> extends TableOptions<D> {
  tableClassName?: string;
  showSearchInput?: boolean;
  pageSizeOptions?: SizeOption[]; // available page size options
  maxPageItemCount?: number;
  hooks?: PluginHook<D>[]; // any additional hooks
  width?: string | number;
  height?: string | number;
  pageSize?: number;
  noResultsText?: string | ((filterString: string) => ReactNode);
  sticky?: boolean;
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
  sticky: doSticky,
  showSearchInput,
  noResultsText = 'No data found',
  hooks,
  globalFilter: userGlobalFilterFn,
  ...moreUseTableOptions
}: DataTableProps<D>) {
  const tableHooks: PluginHook<D>[] = [
    useGlobalFilter,
    useSortBy,
    usePagination,
    useColumnCellProps,
    doSticky ? useSticky : [],
    hooks || [],
  ].flat();
  const [showAll, setShowAll] = useState(initialPageSize === 0);
  const sortByRef = useRef([]);
  const hasPagination = initialPageSize > 0; // pageSize == 0 means no pagination
  const hasGlobalControl = hasPagination || showSearchInput;
  const initialState = {
    ...initialState_,
    // zero length means all pages, the `usePagination` plugin does not
    // understand pageSize = 0
    sortBy: sortByRef.current,
    pageSize: hasPagination ? initialPageSize : data.length,
  };

  const wrapperRef = useRef<HTMLDivElement>(null);
  const globalControlRef = useRef<HTMLDivElement>(null);
  const paginationRef = useRef<HTMLDivElement>(null);

  const defaultGetTableSize = useCallback(() => {
    if (wrapperRef.current) {
      const width = wrapperRef.current.clientWidth || Number(initialWidth);
      const height =
        (wrapperRef.current.clientHeight || Number(initialHeight)) -
        (globalControlRef.current?.clientHeight || 0) -
        (paginationRef.current?.clientHeight || 0);
      return { width, height };
    }
    return undefined;
  }, [initialHeight, initialWidth]);

  const defaultGlobalFilter: FilterType<D> = useCallback(
    (rows: Row<D>[], columnIds: IdType<D>[], filterValue: string) => {
      // allow searching by "col1 col2"
      const joinedString = (row: Row<D>) => {
        return columnIds.map(x => row.values[x]).join(' ');
      };
      return matchSorter(rows, filterValue, {
        keys: [...columnIds, joinedString],
      }) as typeof rows;
    },
    [],
  );
  defaultGlobalFilter.autoRemove = val => !val;

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
    wrapStickyTable,
    state: { pageIndex, pageSize, globalFilter: filterValue, sticky = {} },
  } = useTable<D>(
    {
      columns,
      data,
      initialState,
      getTableSize: defaultGetTableSize,
      globalFilter: defaultGlobalFilter,
      ...moreUseTableOptions,
    },
    ...tableHooks,
  );

  useMountedLayoutEffect(() => {
    // force upate the pageSize when it's been update from the initial state
    setPageSize(initialState.pageSize);
  }, [initialState.pageSize]);

  useMountedLayoutEffect(() => {
    if (showAll) {
      setPageSize(data.length);
    }
  }, [data.length]);

  const renderTable = () => (
    <table {...getTableProps({ className: tableClassName })}>
      <thead>
        {headerGroups.map(headerGroup => {
          const { key: headerGroupKey, ...headerGroupProps } = headerGroup.getHeaderGroupProps();
          return (
            <tr key={headerGroupKey || headerGroup.id} {...headerGroupProps}>
              {headerGroup.headers.map(column => {
                const { key: headerKey, className, ...props } = column.getHeaderProps(
                  column.getSortByToggleProps(),
                );
                return (
                  <th
                    key={headerKey || column.id}
                    className={column.isSorted ? `${className || ''} is-sorted` : className}
                    {...props}
                  >
                    {column.render('Header')}
                    {column.render('SortIcon')}
                  </th>
                );
              })}
            </tr>
          );
        })}
      </thead>
      <tbody {...getTableBodyProps()}>
        {page && page.length > 0 ? (
          page.map(row => {
            prepareRow(row);
            const { key: rowKey, ...rowProps } = row.getRowProps();
            return (
              <tr key={rowKey || row.id} {...rowProps}>
                {row.cells.map(cell => {
                  const cellProps = cell.getCellProps() as TableCellProps & RenderHTMLCellProps;
                  const { key: cellKey, cellContent, ...restProps } = cellProps;
                  const key = cellKey || cell.column.id;
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
              {typeof noResultsText === 'function'
                ? noResultsText(filterValue as string)
                : noResultsText}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );

  return (
    <div ref={wrapperRef} style={{ width: initialWidth, height: initialHeight }}>
      {hasGlobalControl ? (
        <div ref={globalControlRef} className="form-inline dt-controls">
          <div className="row">
            <div className="col-sm-6">
              {hasPagination ? (
                <SelectPageSize
                  total={data.length}
                  sizeOptions={pageSizeOptions}
                  currentSize={pageSize}
                  onChange={size => {
                    setShowAll(size === 0);
                    setPageSize(size === 0 ? data.length : size);
                  }}
                />
              ) : null}
            </div>
            {showSearchInput ? (
              <div className="col-sm-6">
                <GlobalFilter<D>
                  preGlobalFilteredRows={preGlobalFilteredRows}
                  setGlobalFilter={setGlobalFilter}
                  filterValue={filterValue}
                />
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
      {wrapStickyTable ? wrapStickyTable(renderTable) : renderTable()}
      {hasPagination ? (
        <SimplePagination
          ref={paginationRef}
          style={sticky.height ? undefined : { visibility: 'hidden' }}
          maxPageItemCount={maxPageItemCount}
          pageCount={pageCount}
          currentPage={pageIndex}
          onPageChange={gotoPage}
        />
      ) : null}
    </div>
  );
}
