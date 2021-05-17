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
import { QueryObjectFilterClause } from "./types/Query";

type DrilldownType = {
  hierarchy: string[];
  currentIdx: number;
  filters: QueryObjectFilterClause[];
}

export default class DrillDown {
  static fromHierarchy(
    hierarchy: string[]
  ): DrilldownType {
    return {
      hierarchy: hierarchy,
      currentIdx: hierarchy.length > 0 ? 0 : -1,
      filters: [],
    };
  }

  static drillDown(
    value: DrilldownType,
    selectValue: string,
  ): DrilldownType {
    const idx = value.currentIdx;
    const len = value.hierarchy.length;

    if (idx + 1 >= len) {
      return {
        hierarchy: value.hierarchy,
        currentIdx: 0,
        filters: [],
      }
    }
    return {
      hierarchy: value.hierarchy,
      currentIdx: idx + 1,
      filters: value.filters.concat({
        col: value.hierarchy[idx],
        op: 'IN',
        val: [selectValue],
      })
    }
  }

  static getColumn(
    value: DrilldownType,
  ): string {
    return value.hierarchy[value.currentIdx];
  }
  // static rollUp(
  //   value: DrilldownType,
  // ): DrilldownType {
    // if (this.value.currentIdx === -1) return;
    // const idx = this.value.currentIdx;
    // const len = this.value.hierarchy.length;
    // this.value.currentIdx = idx - 1 < 0 ? len - 1 : idx - 1;
    // this.value.filters.pop();
  // }
}
