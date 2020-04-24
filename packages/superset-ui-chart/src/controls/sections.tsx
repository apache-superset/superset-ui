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
import { t } from '@superset-ui/translation';

// A few standard controls sections that are used internally.
// Not recommended for use in third-party plugins.

export const druidTimeSeries = {
  label: t('Time'),
  expanded: true,
  description: t('Time related form attributes'),
  controlSetRows: [['time_range']],
};

export const datasourceAndVizType = {
  label: t('Datasource & Chart Type'),
  expanded: true,
  controlSetRows: [
    ['datasource'],
    ['viz_type'],
    ['slice_id', 'cache_timeout', 'url_params', 'time_range_endpoints'],
  ],
};

export const colorScheme = {
  label: t('Color Scheme'),
  controlSetRows: [['color_scheme', 'label_colors']],
};

export const sqlaTimeSeries = {
  label: t('Time'),
  description: t('Time related form attributes'),
  expanded: true,
  controlSetRows: [['granularity_sqla'], ['time_range']],
};

export const annotations = {
  label: t('Annotations and Layers'),
  expanded: true,
  controlSetRows: [['annotation_layers']],
};
