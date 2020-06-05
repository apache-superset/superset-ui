/* eslint-disable @typescript-eslint/no-empty-interface */
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
  useRef,
  useLayoutEffect,
  useCallback,
  ReactNode,
  ReactElement,
  ComponentPropsWithRef,
  CSSProperties,
  UIEventHandler,
} from 'react';
import { TableInstance, Hooks, ensurePluginOrder } from 'react-table';

interface ReactElementWithChildren<
  T extends keyof JSX.IntrinsicElements,
  C extends ReactNode = ReactNode
> extends ReactElement<ComponentPropsWithRef<T> & { children: C }, T> {}

type th = ReactElementWithChildren<'th'>;
type td = ReactElementWithChildren<'td'>;
type trWithTh = ReactElementWithChildren<'tr', th>;
type trWithTd = ReactElementWithChildren<'tr', td>;
type thead = ReactElementWithChildren<'thead', trWithTh>;
type tbody = ReactElementWithChildren<'tbody', trWithTd>;
type col = ReactElementWithChildren<'col', null>;
type colgroup = ReactElementWithChildren<'colgroup', col>;
type table = ReactElementWithChildren<'table', (thead | tbody | colgroup)[]>;

export interface StickyElementSize {
  width?: number; // full table width
  height?: number; // full table height
  bodyWidth?: number; // scrollable area width
  bodyHeight?: number; // scrollable area height
  columnWidths?: number[];
}

export interface UseStickyTableOptions {
  getTableSize?: () => Partial<StickyElementSize> | undefined;
}

export interface UseStickyInstanceProps {
  StickyWrap: React.FunctionComponent<{ children: table }>;
  setStickyElementSize: (size?: StickyElementSize) => void; // recompute the sticky table size
}

export type UseStickyState = {
  sticky: StickyElementSize;
};

export enum ReducerActions {
  init = 'init', // this is from global reducer
  setStickyElementSize = 'setStickyElementSize',
}

export type ReduceAction<T extends string, P extends Record<string, unknown>> = {
  [K in keyof P]: P[K];
} & { type: T };

type PropsOrGetProps<
  P extends Record<string, unknown> = Record<string, unknown>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  A extends any[] = any[]
> = Partial<P> | ((...args: A) => Partial<P>);

const DEFAULT_THEAD_HEIGHT = 38; // when all th has only 1 line of text

function mergeStyleProp(node: ReactElement<{ style?: CSSProperties }>, style: CSSProperties) {
  return {
    style: {
      ...node.props.style,
      ...style,
    },
  };
}

function getProps(propsGetter?: PropsOrGetProps, ...args: unknown[]) {
  return typeof propsGetter === 'function' ? propsGetter(...args) : propsGetter;
}

function cloneTableSection<
  S extends thead | tbody,
  R extends trWithTh | trWithTd = S extends thead ? trWithTh : trWithTd,
  C extends th | td = S extends thead ? th : td
>({
  section,
  sectionProps,
  rowProps,
  cellProps,
  cellChildren,
}: {
  section: S;
  sectionProps?: PropsOrGetProps<S['props'], [S, number]>;
  rowProps?: PropsOrGetProps<R['props'], [R, number]>;
  cellProps?: PropsOrGetProps<C['props'], [C, number]>;
  cellChildren?: (cell: C) => C;
}) {
  return React.cloneElement(
    section,
    getProps(sectionProps, section),
    // clone all the way down to tr -> th -> child and set height to zero
    ...React.Children.map(section.props.children as R, (row, rowIndex) =>
      React.cloneElement(
        row,
        getProps(rowProps, row, rowIndex),
        ...React.Children.map(row.props.children as C, (cell, colIndex) =>
          React.cloneElement(
            cell,
            getProps(cellProps, cell, colIndex),
            cellChildren ? cellChildren(cell) : cell.props.children,
          ),
        ),
      ),
    ),
  );
}

/**
 * An HOC for generating sticky header and fixed-height scrollable area
 */
function StickyWrap({
  children,
  sticky = {},
  setStickyElementSize,
}: {
  children: table;
  setStickyElementSize: UseStickyInstanceProps['setStickyElementSize'];
  sticky?: StickyElementSize; // current sticky element sizes
}) {
  const table: table = children;
  if (!table || table.type !== 'table') {
    throw new Error('<StickyWrap> must have only one <table> element as child');
  }
  let thead;
  let tbody;
  let colgroup;
  React.Children.forEach(table.props.children, node => {
    if (node.type === 'thead') {
      thead = node;
    } else if (node.type === 'tbody') {
      tbody = node;
    } else if (node.type === 'colgroup') {
      colgroup = node;
    }
  });
  if (!thead || !tbody) {
    throw new Error('<table> in <StickyWrap> must contain both thead and tbody.');
  }
  const theadRef = useRef<HTMLTableSectionElement>(null);
  const scrollHeaderRef = useRef<HTMLDivElement>(null); // fixed header
  const scrollBodyRef = useRef<HTMLDivElement>(null); // main body

  const { width, height, bodyHeight, columnWidths } = sticky;

  // update scrollable area and header column sizes when mounted
  useLayoutEffect(() => {
    if (!height || !theadRef.current) {
      return;
    }
    const bodyThead = theadRef.current;
    const theadHeight = bodyThead.clientHeight;
    const ths = bodyThead.childNodes[0].childNodes as NodeListOf<HTMLTableHeaderCellElement>;
    const widths = Array.from(ths).map(th => th.clientWidth);
    const newSize = {
      bodyHeight: height - theadHeight,
      columnWidths: widths,
    };
    setStickyElementSize(newSize);
  }, [height, setStickyElementSize]);

  if (!columnWidths) {
    const theadWithRef = cloneTableSection<thead>({
      section: thead,
      sectionProps: {
        ref: theadRef,
      },
    });
    const bodyTable = React.cloneElement(table, {}, colgroup, theadWithRef, tbody);
    return <div style={{ height, overflow: 'hidden' }}>{bodyTable}</div>;
  }

  // if users didn't specify <colgroup>, use computed width
  colgroup = colgroup || (
    <colgroup>
      {columnWidths.map((w, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <col key={i} width={w} />
      ))}
    </colgroup>
  );

  const fallbackBodyHeight = bodyHeight || (height && height - DEFAULT_THEAD_HEIGHT);
  const totalWidth = columnWidths.reduce((a, b) => a + b);
  const needHorizontalScroll = width && width < totalWidth;

  const tableStyle: CSSProperties = { tableLayout: 'fixed', width: totalWidth };
  const wrapperStyle: CSSProperties = {
    width,
    height,
    overflow: 'hidden',
  };
  const bodyStyle: CSSProperties = {
    height: fallbackBodyHeight,
    overflow: 'scroll',
  };
  const headerStyle: CSSProperties = {
    overflow: 'hidden',
  };
  const headerTable = React.cloneElement(table, mergeStyleProp(table, tableStyle), colgroup, thead);
  const bodyTable = React.cloneElement(table, mergeStyleProp(table, tableStyle), colgroup, tbody);
  const onScroll: UIEventHandler<HTMLDivElement> = e => {
    if (scrollHeaderRef.current) {
      scrollHeaderRef.current.scrollLeft = e.currentTarget.scrollLeft;
    }
  };

  return (
    <div style={wrapperStyle}>
      <div ref={scrollHeaderRef} style={headerStyle}>
        {headerTable}
      </div>
      <div
        ref={scrollBodyRef}
        style={bodyStyle}
        onScroll={needHorizontalScroll ? onScroll : undefined}
      >
        {bodyTable}
      </div>
    </div>
  );
}

function useInstance<D extends object>(instance: TableInstance<D>) {
  ensurePluginOrder(instance.plugins, ['useGlobalFilters', 'usePagination'], 'useSticky');

  const {
    dispatch,
    state: { sticky },
    getTableSize = () => undefined,
  } = instance;

  const setStickyElementSize = useCallback(
    (partialSize: Partial<StickyElementSize> | undefined = getTableSize()) => {
      const size = partialSize;
      if (size) {
        // reset `columnWidths` if container size is updated
        if ((size.width || size.height) && !size.columnWidths) {
          size.columnWidths = undefined;
        }
        dispatch({
          type: ReducerActions.setStickyElementSize,
          size,
        });
      }
    },
    [dispatch, getTableSize],
  );

  function LocalStickyWrap({ children }: { children: table }) {
    return (
      <StickyWrap sticky={sticky} setStickyElementSize={setStickyElementSize}>
        {children}
      </StickyWrap>
    );
  }

  Object.assign(instance, {
    setStickyElementSize,
    StickyWrap: LocalStickyWrap,
  });
}

export default function useSticky<D extends object>(hooks: Hooks<D>) {
  hooks.useInstance.push(useInstance);
  hooks.stateReducers.push((newState, action_) => {
    const action = action_ as ReduceAction<ReducerActions, { size: StickyElementSize }>;
    if (action.type === ReducerActions.init) {
      return {
        ...newState,
        sticky: newState.sticky || {},
      };
    }
    if (action.type === ReducerActions.setStickyElementSize) {
      return {
        ...newState,
        sticky: { ...newState.sticky, ...action.size },
      };
    }
    return newState;
  });
}
useSticky.pluginName = 'useSticky';
