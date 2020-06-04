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
import React from 'react';
import { Row, FilterValue, useAsyncDebounce } from 'react-table';
import { FormControl } from 'react-bootstrap';

interface GlobalFilterProps<D extends object> {
  preGlobalFilteredRows: Row<D>[];
  globalFilter?: string;
  setGlobalFilter: (filterValue: FilterValue) => void;
}

export default function GlobalFilter<D extends object>({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}: GlobalFilterProps<D>) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce((newValue: string) => {
    setGlobalFilter(newValue || undefined);
  }, 200);

  return (
    <span className="dt-global-filter">
      {t('Search')}{' '}
      <FormControl
        bsSize="small"
        value={value}
        placeholder={`${count} records...`}
        onChange={e => {
          const target = e.target as HTMLInputElement;
          e.preventDefault();
          setValue(target.value);
          onChange(target.value);
        }}
      />
    </span>
  );
}
