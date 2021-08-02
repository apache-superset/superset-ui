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
import React from 'react';
import { Tooltip } from './Tooltip';
import { ColumnTypeLabel } from './ColumnTypeLabel';
import InfoTooltipWithTrigger from './InfoTooltipWithTrigger';
import { ColumnMeta } from '../types';

export type ColumnOptionProps = {
  column: ColumnMeta;
  showType?: boolean;
  showTooltip?: boolean;
  labelRef?: React.RefObject<any>;
};

export function ColumnOption({
  column,
  labelRef,
  showType = false,
  showTooltip = true,
}: ColumnOptionProps) {
  const { expression, column_name, type_generic } = column;
  const hasExpression = expression && expression !== column_name;
  const type = hasExpression ? 'expression' : type_generic;

  return (
    <span>
      {showType && type !== undefined && <ColumnTypeLabel type={type} />}
      <span className="m-r-5 option-label column-option" ref={labelRef}>
        {showTooltip ? (
          <Tooltip
            id="metric-name-tooltip"
            title={column.verbose_name || column.column_name}
            trigger={['hover']}
            placement="top"
          >
            {column.verbose_name || column.column_name}
          </Tooltip>
        ) : (
          column.verbose_name || column.column_name
        )}
      </span>
      {column.description && (
        <InfoTooltipWithTrigger
          className="m-r-5 text-muted"
          icon="info"
          tooltip={column.description}
          label={`descr-${column.column_name}`}
          placement="top"
        />
      )}
      {hasExpression && (
        <InfoTooltipWithTrigger
          className="m-r-5 text-muted"
          icon="question-circle-o"
          tooltip={column.expression}
          label={`expr-${column.column_name}`}
          placement="top"
        />
      )}
    </span>
  );
}

export default ColumnOption;
