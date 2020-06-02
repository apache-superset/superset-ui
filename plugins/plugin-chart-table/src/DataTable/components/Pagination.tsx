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

interface PaginationProps {
  pageCount: number; // number of pages
  currentPage?: number; // index of current page, zero-based
  maxPageItemCount?: number;
  ellipsis?: string; // content for ellipsis item
  gotoPage: (page: number) => void; // `page` is zero-based
}

/**
 * Generate numeric page items in the form of
 *  first, ..., prev, current, next, ..., last
 */
function generatePageItems(pageCount: number, currentPage: number, maxPageItemCount: number) {
  let pageItems: (string | number)[] = [currentPage];
  if (maxPageItemCount < 7) {
    throw new Error('Must allow at least 5 page items');
  }
  if (pageCount > maxPageItemCount) {
    let left = currentPage - 1;
    let right = currentPage + 1;
    while (pageItems.length < maxPageItemCount && (left > -1 || right < pageCount)) {
      if (left > -1) {
        pageItems.unshift(left);
        left -= 1;
      }
      if (right < pageCount) {
        pageItems.push(right);
        right += 1;
      }
    }
    // replace non-ending items with placeholders
    if (pageItems[0] > 0) {
      pageItems[0] = 0;
      if (pageItems[1] > 1) {
        pageItems[1] = 'prev-more';
      }
    }
    if (pageItems[pageItems.length - 1] < pageCount - 1) {
      pageItems[pageItems.length - 1] = pageCount - 1;
      if (pageItems[pageItems.length - 2] < pageCount - 2) {
        pageItems[pageItems.length - 2] = 'next-more';
      }
    }
  } else {
    pageItems = [...new Array(pageCount).keys()];
  }
  return pageItems;
}

export default React.forwardRef(function Pagination(
  { pageCount, currentPage = 0, maxPageItemCount = 9, gotoPage }: PaginationProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const pageItems = generatePageItems(pageCount, currentPage, maxPageItemCount);
  return (
    <div ref={ref} className="dt-pagination">
      <ul className="pagination pagination-sm">
        {pageItems.map((item, i) =>
          typeof item === 'number' ? (
            // actual page number
            <li key={item} className={currentPage === item ? 'active' : undefined}>
              <a
                href={`#page-${item}`}
                role="button"
                onClick={e => {
                  e.preventDefault();
                  gotoPage(item);
                }}
              >
                {item + 1}
              </a>
            </li>
          ) : (
            <li key={item} className="dt-pagination-ellipsis">
              <span>…</span>
            </li>
          ),
        )}
      </ul>
    </div>
  );
});
