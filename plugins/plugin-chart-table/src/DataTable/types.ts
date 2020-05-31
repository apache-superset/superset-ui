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
import { HTMLProps } from 'react';
import {
  UseTableOptions,
  TableState,
  TableInstance,
  UseSortByState,
  UseSortByOptions,
  UseSortByInstanceProps,
  UseGlobalFiltersState,
  UseGlobalFiltersOptions,
  UseGlobalFiltersInstanceProps,
  UsePaginationState,
  UsePaginationOptions,
  UsePaginationInstanceProps,
  Row,
  Cell,
  ColumnInstance,
  UseSortByColumnProps,
  HeaderGroup,
  PluginHook,
} from 'react-table';

export interface DataTableState<D extends object>
  extends TableState<D>,
    UseGlobalFiltersState<D>,
    UseSortByState<D>,
    UsePaginationState<D> {}

export interface DataTableOptions<D extends object> extends UseTableOptions<D> {
  columns: UseTableOptions<D>['columns'] & DataTableColumnOption<D>;
  initialState?: Partial<DataTableState<D>>;
}

export interface DataTableProps<D extends object>
  extends DataTableOptions<D>,
    UsePaginationOptions<D>,
    UseSortByOptions<D>,
    UseGlobalFiltersOptions<D> {
  className?: string;
  height?: number; // max height for whole data table including controls
  showSearchInput?: boolean;
  pageSize?: number; // initial page size
  pageSizeOptions?: number[]; // available page size options
  hooks?: PluginHook<D>[]; // any additional hooks
}

export interface DataTableCell<D extends object, v = unknown> extends Cell<D, v> {
  column: DataTableColumnInstance<D>;
  row: DataTableRow<D>;
}

export interface DataTableCellProps extends HTMLProps<HTMLTableCellElement> {
  textContent?: string;
}

export interface DataTableRow<D extends object> extends Row<D> {
  cells: DataTableCell<D>[];
}

export type DataTableColumnCellProps<D extends object, v = unknown> = (
  cell: DataTableCell<D, v>,
) => HTMLProps<HTMLTableDataCellElement> | undefined;

export interface DataTableColumnOption<D extends object, v = unknown> {
  cellProps?: DataTableColumnCellProps<D, v>;
}

export interface DataTableColumnInstance<D extends object>
  extends ColumnInstance<D>,
    UseSortByColumnProps<D>,
    DataTableColumnOption<D> {}

export interface DataTableHeaderGroup<D extends object> extends HeaderGroup<D> {
  headers: DataTableColumnInstance<D>[];
}

export interface DataTableHead<D extends object> {
  headerGroups: DataTableHeaderGroup<D>[];
}

export interface DataTableInstance<D extends object>
  extends TableInstance<D>,
    UseGlobalFiltersInstanceProps<D>,
    UseSortByInstanceProps<D>,
    UsePaginationInstanceProps<D> {
  page: DataTableRow<D>[];
  state: Partial<DataTableState<D>>;
  headerGroups: DataTableHeaderGroup<D>[];
}
