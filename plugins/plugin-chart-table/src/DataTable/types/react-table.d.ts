import {
  UseGlobalFiltersState,
  UseGlobalFiltersOptions,
  UseGlobalFiltersInstanceProps,
  UsePaginationInstanceProps,
  UsePaginationOptions,
  UsePaginationState,
  UseSortByColumnOptions,
  UseSortByColumnProps,
  UseSortByInstanceProps,
  UseSortByOptions,
  UseSortByState,
  UseTableHooks,
  UseSortByHooks,
  TableInstance,
  ColumnInstance,
} from 'react-table';

import { UseColumnCellPropsColumnOption } from '../hooks/useColumnCellProps';
import { UseStickyState, UseStickyTableOptions, UseStickyInstanceProps } from '../hooks/useSticky';

declare module 'react-table' {
  // take this file as-is, or comment out the sections that don't apply to your plugin configuration

  export interface TableOptions<D extends object>
    extends UseExpandedOptions<D>,
      UseGlobalFiltersOptions<D>,
      UsePaginationOptions<D>,
      UseRowSelectOptions<D>,
      UseSortByOptions<D>,
      UseStickyTableOptions {}

  export interface TableInstance<D extends object>
    extends UseColumnOrderInstanceProps<D>,
      UseExpandedInstanceProps<D>,
      UseGlobalFiltersInstanceProps<D>,
      UsePaginationInstanceProps<D>,
      UseRowSelectInstanceProps<D>,
      UseRowStateInstanceProps<D>,
      UseSortByInstanceProps<D>,
      UseStickyInstanceProps {}

  export interface TableState<D extends object>
    extends UseColumnOrderState<D>,
      UseExpandedState<D>,
      UseGlobalFiltersState<D>,
      UsePaginationState<D>,
      UseRowSelectState<D>,
      UseSortByState<D>,
      UseStickyState {}

  export interface ColumnInterface<D extends object>
    extends UseGlobalFiltersColumnOptions<D>,
      UseSortByColumnOptions<D>,
      UseColumnCellPropsColumnOption<D> {}

  // Tye typing from @types/react-table is incomplete
  interface TableSortByToggleProps {
    style?: React.CSSProperties;
    title?: string;
    onClick?: React.MouseEventHandler;
  }

  export interface ColumnInstance<D extends object>
    extends UseGlobalFiltersColumnOptions<D>,
      UseSortByColumnProps<D>,
      UseColumnCellPropsColumnOption<D> {
    getSortByToggleProps: (props?: Partial<TableSortByToggleProps>) => TableSortByToggleProps;
  }

  export interface Hooks<D extends object> extends UseTableHooks<D>, UseSortByHooks<D> {}
}
