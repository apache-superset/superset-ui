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
import { QueryFormData } from '@superset-ui/query';
import { HelloWorldProps } from './HelloWorld';

/**
 * Note: All of Superset is in the process of migrating to TypeScript!
 * For more information, see SIP-36:
 * https://github.com/apache/incubator-superset/issues/9101
 *
 * If you are not comfortable with Typescript, and do not intend to
 * open a pull request with your new plugin, feel free to do one
 * of the following:
 * - Convert your .ts(x) files to .js(x) to opt out completely
 * - Use "// @ts-ignore" comments for single lines, or "// @ts-nocheck"
 *   at the top of a file to opt out of type checking completely.
 */

/**
 * FormData contains both common properties of all form data
 * and properties specific to HelloWorld visualization
 */
export type HelloWorldFormData = QueryFormData &
  HelloWorldProps & {
    series: string;
  };
