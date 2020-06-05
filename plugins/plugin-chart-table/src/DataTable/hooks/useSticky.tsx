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
import { TableInstance, Hooks } from 'react-table';

type ReactElementWithChildren<
  T extends keyof JSX.IntrinsicElements,
  C extends ReactNode = ReactNode
> = ReactElement<ComponentPropsWithRef<T> & { children: C }, T>;

type Th = ReactElementWithChildren<'th'>;
type Td = ReactElementWithChildren<'td'>;
type TrWithTh = ReactElementWithChildren<'tr', Th>;
type TrWithTd = ReactElementWithChildren<'tr', Td>;
type Thead = ReactElementWithChildren<'thead', TrWithTh>;
type Tbody = ReactElementWithChildren<'tbody', TrWithTd>;
type Col = ReactElementWithChildren<'col', null>;
type ColGroup = ReactElementWithChildren<'colgroup', Col>;
type Table = ReactElementWithChildren<'table', (Thead | Tbody | ColGroup)[]>;

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
  // HOC for manipulating DOMs in <table> to make the header sticky
  StickyWrap: React.FunctionComponent<{ children: Table }>;
  // update or recompute the sticky table size
  setStickyElementSize: (size?: StickyElementSize) => void;
}

export type UseStickyState = {
  sticky: StickyElementSize;
};

export enum ReducerActions {
  init = 'init', // this is from global reducer
  setStickyElementSize = 'setStickyElementSize',
}

export type ReducerAction<T extends string, P extends Record<string, unknown>> = P & { type: T };

const DEFAULT_THEAD_HEIGHT = 38; // when all th has only 1 line of text

function mergeStyleProp(node: ReactElement<{ style?: CSSProperties }>, style: CSSProperties) {
  return {
    style: {
      ...node.props.style,
      ...style,
    },
  };
}

/**
 * An HOC for generating sticky header and fixed-height scrollable area
 */
function StickyWrap({
  children,
  sticky = {},
  setStickyElementSize,
}: {
  children: Table;
  setStickyElementSize: UseStickyInstanceProps['setStickyElementSize'];
  sticky?: StickyElementSize; // current sticky element sizes
}) {
  const table: Table = children;
  if (!table || table.type !== 'table') {
    throw new Error('<StickyWrap> must have only one <table> element as child');
  }

  let thead: Thead | undefined;
  let tbody: Tbody | undefined;
  let colgroup: ColGroup | undefined;
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
    const tableHeight = (bodyThead.parentNode as HTMLTableElement).clientHeight;
    const ths = bodyThead.childNodes[0].childNodes as NodeListOf<HTMLTableHeaderCellElement>;
    const widths = Array.from(ths).map(th => th.clientWidth);
    const maxHeight = Math.min(height, tableHeight);
    const newSize = {
      height: maxHeight,
      bodyHeight: maxHeight - theadHeight,
      columnWidths: widths,
    };
    setStickyElementSize(newSize);
  }, [height, setStickyElementSize]);

  if (!columnWidths) {
    const theadWithRef = React.cloneElement(thead, { ref: theadRef });
    const bodyTable = React.cloneElement(table, {}, colgroup, theadWithRef, tbody);
    return <div style={{ height, overflow: 'auto' }}>{bodyTable}</div>;
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

  const tableStyle: CSSProperties = { tableLayout: 'fixed' };
  const wrapperStyle: CSSProperties = {
    width,
    height,
    overflow: 'hidden',
  };
  const bodyStyle: CSSProperties = {
    height: fallbackBodyHeight,
    overflow: 'auto',
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
  const {
    dispatch,
    state: { sticky },
    getTableSize = () => undefined,
  } = instance;

  const setStickyElementSize = useCallback(
    (partialSize: Partial<StickyElementSize> | undefined = getTableSize()) => {
      const size = partialSize;
      if (size) {
        // make sure size has empty `columnWidths` property when container size
        // is updated so columnWidths can be reset and recomputed
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

  function LocalStickyWrap({ children }: { children: Table }) {
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
    const action = action_ as ReducerAction<ReducerActions, { size: StickyElementSize }>;
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
