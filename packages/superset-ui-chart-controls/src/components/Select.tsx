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
import React, { useState, ReactNode, ReactElement } from 'react';
import AntdSelect, { SelectProps as AntdSelectProps, OptionProps } from 'antd/lib/select';

export const { Option } = AntdSelect;

export type SelectOption<VT = string> = [VT, ReactNode];

export type SelectProps<VT> = Omit<AntdSelectProps<VT>, 'options'> & {
  creatable?: boolean;
  options?: SelectOption<VT>[];
};

/**
 * AntD select with creatable options.
 */
export default function Select<VT extends string | number>({
  creatable,
  children,
  onSearch,
  dropdownMatchSelectWidth = false,
  showSearch: showSearch_ = true,
  options,
  ...props
}: SelectProps<VT>) {
  const [searchValue, setSearchValue] = useState<string>();
  // force show search if creatable
  const showSearch = showSearch_ || creatable;
  const handleSearch = showSearch
    ? (input: string) => {
        if (creatable) {
          setSearchValue(input);
        }
        if (onSearch) {
          onSearch(input);
        }
      }
    : undefined;

  const searchValueNotFound = React.Children.toArray(children).every(
    node => node && (node as ReactElement<OptionProps>).props.value !== searchValue,
  );

  return (
    <AntdSelect<VT>
      dropdownMatchSelectWidth={dropdownMatchSelectWidth}
      showSearch={showSearch}
      onSearch={handleSearch}
      {...props}
    >
      {options?.map(([val, label]) => (
        <Option value={val}>{label}</Option>
      ))}
      {children}
      {searchValue && searchValueNotFound && (
        <Option key={searchValue} value={searchValue}>
          {/* Unfortunately AntD select does not support displaying different
          label for option vs select value, so we can't use
          `t('Create "%s"', searchValue)` here */}
          {searchValue}
        </Option>
      )}
    </AntdSelect>
  );
}

Select.Option = Option;
