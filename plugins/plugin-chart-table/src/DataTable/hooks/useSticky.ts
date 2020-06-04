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
import { useCallback } from 'react';
import { Hooks, ensurePluginOrder } from 'react-table';

export interface UseStickyTableOptions {
  getStickyTableSize: () => StickyTableSize | null;
}

export interface UseStickyInstanceProps extends UseStickyTableOptions {
  updateStickyTableSize: () => void;
}

export interface StickyTableSize {
  tableWidth: number; // scrollable area width
  tableHeight: number; // scrollable area height
}

export type UseStickyState = StickyTableSize;

export enum StickyHeadActions {
  setStickyTableSize = 'setStickyTableSize',
}

export default function useSticky<D extends object>(hooks: Hooks<D>) {
  hooks.getHeaderProps.push(props => {
    return [
      props,
      {
        style: {
          position: 'sticky',
          top: 0,
        },
      },
    ];
  });

  hooks.useInstance.push(instance => {
    const { plugins, dispatch, getStickyTableSize } = instance;

    ensurePluginOrder(plugins, ['useGlobalFilters', 'usePagination'], 'useSticky');

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const updateStickyTableSize = useCallback(() => {
      const size = getStickyTableSize();
      if (size) {
        dispatch({
          type: StickyHeadActions.setStickyTableSize,
          size,
        });
      }
    }, [dispatch, getStickyTableSize]);

    Object.assign(instance, {
      updateStickyTableSize,
    });
  });

  hooks.stateReducers.push((newState, action) => {
    if (action.type === StickyHeadActions.setStickyTableSize) {
      Object.assign(newState, action.size as StickyTableSize);
      return newState;
    }
    return newState;
  });
}
useSticky.pluginName = 'useSticky';
