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
import { ChartProps, getMetricLabel } from '@superset-ui/core';
import { EChartsOption, TreeSeriesOption } from 'echarts';
import { TreeSeriesNodeItemOption } from 'echarts/types/src/chart/tree/TreeSeries';

import {
  EchartsTreeFormData,
  DEFAULT_FORM_DATA as DEFAULT_GRAPH_FORM_DATA,
  TreeDataRecord,
} from './types';
import { DEFAULT_TREE_SERIES_OPTION } from './constants';
import { EchartsProps } from '../types';
import Tree from 'echarts/types/src/data/Tree';

export default function transformProps(chartProps: ChartProps): EchartsProps {
  const { width, height, formData, queriesData } = chartProps;
  const data: TreeDataRecord[] = queriesData[0].data || [];

  const {
    id,
    parent,
    name,
    metric = '',
    layout,
    orient,
    symbol,
    symbolSize,
    roam,
    position,
    emphasis,
  }: EchartsTreeFormData = { ...DEFAULT_GRAPH_FORM_DATA, ...formData };
  let { rootNode } = { ...DEFAULT_GRAPH_FORM_DATA, ...formData };
  const metricLabel = getMetricLabel(metric);

  const indexMap: { [name: string]: number } = {};
  let rootNodeId: null | string | number = null;
  let nameColumn: string;
  if (name) {
    nameColumn = name;
  } else {
    nameColumn = id;
  }

  console.log('data ', data, parent);

  function getTree(rootNode, rootNodeId) {
    const tree: TreeSeriesNodeItemOption = { name: rootNode, children: [] };
    const children = [] as TreeSeriesNodeItemOption[];
    //this will just store number of immiediete childrens
    let totalChildren = 0;
    if (!rootNodeId) {
      return { tree, totalChildren };
    }

    // fill indexMap with node ids and find root node id if already not found
    for (let i = 0; i < data.length; i += 1) {
      const nodeId = data[i][id];
      indexMap[nodeId] = i;
      children[i] = [];

      if (!rootNodeId && data[i][nameColumn]?.toString() === rootNode) {
        rootNodeId = nodeId;
      }
    }

    // find children of tree
    if (rootNodeId) {
      for (let i = 0; i < data.length; i++) {
        const node = data[i];
        if (node[parent] === rootNodeId) {
          tree.children?.push({
            name: node[nameColumn],
            children: children[i],
            value: node[metricLabel],
          });
          //FIXME: not getting correct child length

          totalChildren = totalChildren + children[i].length;
        } else {
          const parentId = node[parent];
          if (data[indexMap[parentId]]) {
            const parentIndex = indexMap[parentId];
            children[parentIndex].push({
              name: node[nameColumn],
              children: children[i],
              value: node[metricLabel],
            });
          }
        }
      }
    }

    return { tree, totalChildren };
  }

  function getNodeId(name) {
    let nodeId = null;
    data.some(node => {
      if (node[nameColumn].toString() === name) {
        nodeId = node[id];

        return true;
      }
      return false;
    });

    return nodeId;
  }

  let finalTree = null;

  if (!rootNode) {
    // find node whose parent has only 1 child
    const parentChildMap = {};
    data.forEach(node => {
      if (node[parent] in parentChildMap) {
        parentChildMap[node[parent]].count += 1;
        parentChildMap[node[parent]].children.push({ name: node[nameColumn], id: node[id] });
      } else {
        parentChildMap[node[parent]] = {
          count: 1,
          children: [{ name: node[nameColumn], id: node[id] }],
        };
      }
    });

    let maxChildren = 0;
    // for each parent node who has 1 count from childMap,find tree and total children for them

    for (const key in parentChildMap) {
      if (parentChildMap[key].count == 1) {
        //find tree for only first node of root parent
        const { tree, totalChildren } = getTree(
          parentChildMap[key].children[0].name,
          parentChildMap[key].children[0].id,
        );
        if (totalChildren >= maxChildren) {
          finalTree = tree;
        }
      }
    }
  } else {
    // ui gave root node id/ name
    const id = getNodeId(rootNode);

    const { tree } = getTree(rootNode, id);

    finalTree = tree;
  }

  const series: TreeSeriesOption[] = [
    {
      type: 'tree',
      data: [finalTree],
      label: { ...DEFAULT_TREE_SERIES_OPTION.label, position },
      emphasis: { focus: emphasis },
      animation: DEFAULT_TREE_SERIES_OPTION.animation,
      layout,
      orient,
      symbol,
      roam,
      symbolSize,
      lineStyle: DEFAULT_TREE_SERIES_OPTION.lineStyle,
      select: DEFAULT_TREE_SERIES_OPTION.select,
      leaves: { label: { position } },
    },
  ];

  const echartOptions: EChartsOption = {
    animationDuration: DEFAULT_TREE_SERIES_OPTION.animationDuration,
    animationEasing: DEFAULT_TREE_SERIES_OPTION.animationEasing,
    series,
    tooltip: {
      trigger: 'item',
      triggerOn: 'mousemove',
    },
  };

  return {
    width,
    height,
    echartOptions,
  };
}
