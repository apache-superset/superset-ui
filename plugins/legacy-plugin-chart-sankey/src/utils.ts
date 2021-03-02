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
type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export const isOverlapping = (rect1: Rect, rect2: Rect): boolean => {
  const { x: x1, y: y1, width: width1, height: height1 } = rect1;
  const { x: x2, y: y2, width: width2, height: height2 } = rect2;

  return !(x1 > x2 + width2 || x1 + width1 < x2 || y1 > y2 + height2 || y1 + height1 < y2);
};

const getRectangle = (element: SVGElement, offset = 0): Rect => {
  const { x, y, width, height } = element.getBoundingClientRect();

  return {
    x,
    y: y + offset,
    width,
    height: height - offset * 2,
  };
};

export const elementsAreOverlapping = (elements: SVGElement[]) => {
  let areOverlapping = false;

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < elements.length - 1; i++) {
    const rect1: Rect = getRectangle(elements[i], 3);

    // eslint-disable-next-line no-plusplus
    for (let j = i + 1; j < elements.length - 1; j++) {
      if (!elements[j]) continue;

      const rect2: Rect = getRectangle(elements[j], 3);
      const result = isOverlapping(rect1, rect2);

      if (result) {
        areOverlapping = true;
        break;
      }
    }

    if (areOverlapping) {
      break;
    }
  }

  return areOverlapping;
};
