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
import styled, { withTheme } from '@superset-ui/style';
import { reactify } from '@superset-ui/chart';

export type HelloWorldProps = {
  height: number;
  width: number;
  data: { x: number; y: number }[];
};

// ********** WHAT YOU CAN BUILD HERE (2 OPTIONS!) **********
// In essence, a chart is given a few key ingredients to work with:
// Data: provided via `props.data`
// A DOM element: You can add your chart in two methods:
// 1) return a block of JSX to drop right into the dashboard
// 2) "reactify" a component, which gives you access to the actual
//    DOM element of your rendered chart (including its ID), which
//    allows you to manipulate the DOM element directly

// EXAMPLE OF OPTION 1
// export default class HelloWorld extends PureComponent<HelloWorldProps> {
//   render() {
//     // height and width are the height and width of the DOM element as it exists in the dashboard.
//     // There is also a `data` prop, which is, of course, your DATA 🎉
//     const { data, height, width } = this.props;

//     // The following Wrapper is a <div> element, which has been styled using Emotion
//     // For docs, visit https://emotion.sh/docs/styled

//     // Theming variables are provided for your use via a ThemeProvider
//     // imported from @superset-ui/style. For variables available, please visit
//     // https://github.com/apache-superset/superset-ui/blob/master/packages/superset-ui-style/src/index.ts

//     const Wrapper = styled.div`
//       background-color: ${({ theme }) => theme.colors.secondary.light2};
//       padding: ${({ theme }) => theme.gridUnit * 4}px;
//       border-radius: ${({ theme }) => theme.gridUnit * 2}px;
//       height: ${height};
//       width: ${width};
//     `;

//     return (
//       <Wrapper>
//         <h3>Hello, World! (option 1)</h3>
//         <pre>
//           {JSON.stringify(data, null, 2)}
//         </pre>
//       </Wrapper>
//     );
//   }
// }

// EXAMPLE OF OPTION 2

const HelloWorld = reactify((elem: unknwown, props: unknwown) => {
  // `elem` is the *actual* dom element being used by this plugin, to do whatever you'd like with
  const { width, height, data, theme } = props; // additional controls appear as props here
  elem.style.width = width;
  elem.style.height = height;
  elem.style.padding = theme.gridUnit * 4 + 'px';
  elem.style.backgroundColor = theme.colors.secondary.light2;
  elem.style.borderRadius = theme.gridUnit * 2 + 'px';
  elem.innerHTML = `<h3>Hello, World! (option 2)</h3><pre>${JSON.stringify(data, null, 2)}</pre>`;
});

export default withTheme(HelloWorld);
