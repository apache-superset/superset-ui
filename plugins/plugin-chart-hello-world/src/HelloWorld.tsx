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
import React, { PureComponent } from 'react';
import styled from '@superset-ui/style';

export type HelloWorldProps = {
  height: number;
  width: number;
  data: { x: number; y: number }[];
};

export default class HelloWorld extends PureComponent<HelloWorldProps> {
  render() {
    const { data, height, width } = this.props;

    // The following Wrapper is a <div> element, which has been styled using Emotion
    // For docs, visit https://emotion.sh/docs/styled

    // Theming variables are provided for your use via a ThemeProvider
    // imported from @superset-ui/style. For variables available, please visit
    // https://github.com/apache-superset/superset-ui/blob/master/packages/superset-ui-style/src/index.ts

    const Wrapper = styled.div`
      background-color: ${({ theme }) => theme.colors.secondary.light2};
      padding: ${({ theme }) => theme.gridUnit * 4}px;
      border-radius: ${({ theme }) => theme.gridUnit * 2}px;
      height: ${height};
      width: ${width};
    `;

    return (
      <Wrapper>
        <h3>Hello, World!</h3>
        <pre>{JSON.stringify(this.props, null, 2)}</pre>
      </Wrapper>
    );
  }
}
