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
import React, { useState, useEffect } from 'react';
import { PieChartTransformedProps } from './types';
import Echart from '../components/Echart';
import { EventHandlers } from '../types';

export default function EchartsPie({
  height,
  width,
  echartOptions,
  emitFilter,
  setDataMask,
  labelMap,
  groupby,
}: PieChartTransformedProps) {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  useEffect(() => {
    if (!emitFilter) {
      return;
    }

    // TODO: for now only process first selection - add support for nested
    //  ANDs in ORs to enable multiple selection
    const groupbyValues = selectedValues.map(value => labelMap[value]);

    if (selectedValues.length === 0) return;
    setDataMask({
      crossFilters: {
        extraFormData: {
          append_form_data: {
            filters: groupby.map((col, idx) => {
              const val = groupbyValues.map(val => val[idx]);
              if (val === null || val === undefined)
                return {
                  col,
                  op: 'IS NULL',
                };
              return {
                col,
                op: 'IN',
                val: val as (string | number | boolean)[],
              };
            }),
          },
        },
        currentState: {
          value: groupbyValues ?? null,
        },
      },
    });
  }, [selectedValues]);

  const eventHandlers: EventHandlers = emitFilter
    ? {
        click: props => {
          const { name } = props;
          setSelectedValues(prev => {
            if (prev.includes(name)) {
              return prev.filter(value => value !== name);
            }
            return [...prev, name];
          });
        },
      }
    : {};

  return (
    <Echart
      height={height}
      width={width}
      echartOptions={echartOptions}
      eventHandlers={eventHandlers}
    />
  );
}
