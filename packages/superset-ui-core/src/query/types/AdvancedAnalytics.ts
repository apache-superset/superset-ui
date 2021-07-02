/* eslint-disable camelcase */
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
export type RollingType = 'None' | 'mean' | 'sum' | 'std' | 'cumsum';
export interface RollingWindow {
  rolling_type?: RollingType;
  rolling_periods?: number;
  min_periods?: number;
}

export type TimeShiftType =
  | '1 day ago'
  | '1 week ago'
  | '28 days ago'
  | '30 days ago'
  | '52 weeks ago'
  | '1 year ago'
  | '104 weeks ago'
  | '2 years ago';
export type ComparisionType = 'values' | 'absolute' | 'percentage' | 'ratio';
export interface TimeCompare {
  time_compare?: TimeShiftType;
  comparison_type?: ComparisionType;
}

export type ResampleRuleType = '1T' | '1H' | '1D' | '7D' | '1M' | '1AS';
export type ResampleMethodType = 'asfreq' | 'bfill' | 'ffill' | 'median' | 'mean' | 'sum';
export interface Resample {
  resample_rule?: ResampleRuleType;
  resample_method?: ResampleMethodType;
}

export default {};