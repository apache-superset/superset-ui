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
import { TreeSeriesOption } from 'echarts';
import { TooltipOption } from 'echarts/types/src/component/tooltip/TooltipModel';
import { SeriesTooltipOption } from 'echarts/types/src/util/types';

export const DEFAULT_TREE_SERIES_OPTION: TreeSeriesOption = {
  label: {

    position: 'left',
    verticalAlign: 'middle',
    align: 'right',
    fontSize: 15
  },
  emphasis: {
    focus: 'descendant'
  },
  animation: true,
  animationDuration: 500,
  animationEasing: 'cubicOut',
  lineStyle: { color: 'source', curveness: 0.1, width: 1.5 },
  tooltip: {
    trigger: 'item',
    triggerOn: 'mousemove'
  },
};

export const tooltip: Pick<SeriesTooltipOption, 'formatter'> = {
  trigger: 'item',
  triggerOn: 'mousemove'

}