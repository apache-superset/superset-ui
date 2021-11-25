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
import React, { useCallback } from 'react';
import { EventHandlers } from '../types';
import Echart from '../components/Echart';
import { TimeseriesChartTransformedProps } from './types';

// @ts-ignore
export default function EchartsTimeseries({
  formData,
  height,
  width,
  echartOptions,
  groupby,
  labelMap,
  selectedValues,
  setDataMask,
}: TimeseriesChartTransformedProps) {
  const handleChange = useCallback(
    (values: string[]) => {
      if (!formData.emitFilter) {
        return;
      }
      const groupbyValues = values.map(value => labelMap[value]);

      setDataMask({
        extraFormData: {
          filters:
            values.length === 0
              ? []
              : groupby.length === 0
              ? // special case when there are no series
                // the only value we are given is the time in epoch seconds
                // create a filter with the grain of the chart
                [
                  {
                    col: formData.granularitySqla,
                    op: '==',
                    val: values[0],
                    grain: formData.timeGrainSqla,
                  },
                ]
              : groupby.map((col, idx) => {
                  const val = groupbyValues.map(v => v[idx]);
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
        filterState: {
          label: groupbyValues.length ? groupbyValues : undefined,
          value: groupbyValues.length ? groupbyValues : null,
          selectedValues: values.length ? values : null,
        },
      });
    },
    [groupby, labelMap, setDataMask],
  );

  const eventHandlers: EventHandlers = {
    click: props => {
      const { seriesName: name, value: arrayOfValuesClicked } = props;
      // special case when there are no series (nothing in the groupby)
      // the only aggregation is against the grain
      // When the user clicks in the chart we get a datatime and metric columns
      // The first value is the datetime selected
      const datetime = arrayOfValuesClicked[0];

      let chosenValue = name;
      if (groupby.length === 0) {
        // Get the time in seconds epcho, this is the value we will use
        // in the emit filter.
        chosenValue = datetime.getTime();
      }

      const values = Object.values(selectedValues);
      if (values.includes(chosenValue)) {
        handleChange(values.filter(v => v !== chosenValue));
      } else {
        handleChange([chosenValue]);
      }
    },
  };

  return (
    <Echart
      height={height}
      width={width}
      echartOptions={echartOptions}
      eventHandlers={eventHandlers}
      selectedValues={selectedValues}
    />
  );
}
