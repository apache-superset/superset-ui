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
import { formatNumber } from '@superset-ui/core';

function formatCellValue(i, cols, tdText, columnFormats, numberFormat, dateRegex, dateFormatter) {
  const metric = cols[i];
  const format = columnFormats[metric] || numberFormat || '.3s';
  const tdTextType = parseFloat(tdText) ? 'number' : typeof tdText;
  let textContent = tdText;
  let attr = ('data-sort', tdText);

  if (tdTextType === 'number') {
    const parsedValue = parseFloat(tdText);
    textContent = formatNumber(format, parsedValue);
    attr = ('data-sort', parsedValue);
  } else if (tdTextType === 'string') {
    const regexMatch = dateRegex.exec(tdText);
    if (regexMatch) {
      const date = new Date(parseFloat(regexMatch[1]));
      textContent = dateFormatter(date);
      attr = ('data-sort', date);
    }
  } else if (tdText === null) {
    textContent = '';
    attr = ('data-sort', Number.NEGATIVE_INFINITY);
  }

  return { textContent, attr };
}

function formatDateCellValue(text, verboseMap, dateRegex, dateFormatter) {
  const regexMatch = dateRegex.exec(text);
  let cellValue;
  if (regexMatch) {
    const date = new Date(parseFloat(regexMatch[1]));
    cellValue = dateFormatter(date);
  } else {
    cellValue = verboseMap[text] || text;
  }
  return cellValue;
}

export { formatCellValue, formatDateCellValue };
