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
import { validateNonEmpty } from '@superset-ui/validator';

export default {
  // TODO: one example for every predefined control + an example of a custom control
  // TODO: example of map state to props
  // TODO: validators
  // TODO: explanation of queryField
  // TODO: explain controlPanelSections
  // TODO: controlOverrides
  // TODO: Control sections - what's supported now (Query - Other)
  controlPanelSections: [
    {
      label: t('Query'),
      expanded: true,
      controlSetRows: [['groupby'], ['metrics'], ['adhoc_filters'], ['row_limit', null]],
    },
  ],
  controlOverrides: {
    series: {
      validators: [validateNonEmpty],
      clearable: false,
    },
    row_limit: {
      default: 100,
    },
  },
};
