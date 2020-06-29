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
import React, { useEffect, createRef } from 'react';
import styled from '@superset-ui/style';

export type HelloWorldProps = {
  height: number;
  width: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<any, any>; // please add additional typing for your data here
  // add typing here for the props you pass in from transformProps.ts!
  boldText: boolean;
  headerFontSize: 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl';
  headerText: string;
};

/**
 * ******************* WHAT YOU CAN BUILD HERE *******************
 *  In essence, a chart is given a few key ingredients to work with:
 *  * Data: provided via `props.data`
 *  * A DOM element
 *  * FormData (your controls!) provided as props by transformProps.ts
 */

export default function HelloWorld(props: HelloWorldProps) {
  // height and width are the height and width of the DOM element as it exists in the dashboard.
  // There is also a `data` prop, which is, of course, your DATA 🎉
  const { data, height, width } = props;

  const rootElem = createRef<HTMLDivElement>();

  // Often, you just want to get a hold of the DOM and go nuts.
  // Here, you can do that with createRef, and the useEffect hook.
  useEffect(() => {
    const root = rootElem.current as HTMLElement;
    console.log('Plugin element', root);
  });

  console.log('Plugin props', props);

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
    overflow-y: scroll;

    h3 {
      /* You can use your props to control CSS! */
      font-size: ${({ theme }) => theme.typography.sizes[props.headerFontSize]};
      font-weight: ${({ theme }) => theme.typography.weights[props.boldText ? 'bold' : 'normal']};
    }
  `;

  return (
    <Wrapper ref={rootElem}>
      <h3>{props.headerText}</h3>
      <pre>${JSON.stringify(data, null, 2)}</pre>
    </Wrapper>
  );
}
