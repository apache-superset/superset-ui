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
import { ensureIsArray } from '@superset-ui/core';
import React, { useCallback, useEffect } from 'react';
import { PieChartTransformedProps } from './types';
import Echart from '../components/Echart';
import { EventHandlers } from '../types';

export default function EchartsPie({
  height,
  width,
  formData,
  echartOptions,
  emitFilter,
  setDataMask,
  labelMap,
  groupby,
  selectedValues,
}: PieChartTransformedProps) {
  const { currentValue, defaultValue } = formData;
  console.log('Val', selectedValues);
  const handleChange = useCallback(
    (values: string[]) => {
      // TODO: for now only process first selection - add support for nested
      //  ANDs in ORs to enable multiple selection
      const [groupbyValues] = values.map(value => labelMap[value]);
      // if (values.length === 0) return;
      setDataMask({
        crossFilters: {
          extraFormData: {
            append_form_data: {
              filters: groupby.map((col, idx) => {
                console.log(groupbyValues);
                const val = groupbyValues[idx];
                if (val === null || val === undefined)
                  return {
                    col,
                    op: 'IS NULL',
                  };
                return {
                  col,
                  op: '==',
                  val: val as string | number | boolean,
                };
              }),
            },
          },
          currentState: {
            value: groupbyValues ?? null,
          },
        },
        ownFilters: {
          currentState: {
            selectedValues: values,
          },
        },
      });
    },
    [groupby, labelMap, setDataMask],
  );

  useEffect(() => {
    handleChange(currentValue || []);
  }, [JSON.stringify(currentValue), handleChange]);

  useEffect(() => {
    handleChange(defaultValue || []);
  }, [JSON.stringify(defaultValue), handleChange]);

  const eventHandlers: EventHandlers = {
    click: props => {
      const { name } = props;
      console.group('Click');

      console.log('selectedValues', selectedValues);
      console.log('name', name);
      console.log(
        'Update',
        selectedValues.filter(value => value !== name),
      );
      console.groupEnd('Click');
      if (selectedValues.includes(name)) {
        console.log('Includes');
        handleChange(selectedValues.filter(value => value !== name));
      } else {
        console.log('Not includes');
        handleChange([...selectedValues, name]);
      }
    },
  };

  return (
    <Echart
      height={height}
      width={width}
      echartOptions={echartOptions}
      eventHandlers={eventHandlers}
    />
  );
}
