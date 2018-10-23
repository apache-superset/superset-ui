import React from 'react';
import { sprintf } from 'sprintf-js';

function formatForReact(formatString, args) {
  const rv = [];
  let cursor = 0;
  sprintf.parse(formatString).forEach((match, idx) => {
    const copyMatch = match;
    let copyIdx = idx;
    if (typeof match === 'string') {
      rv.push(match);
    } else {
      let arg = null;
      if (match[2]) {
        arg = args[0][match[2][0]];
      } else if (match[1]) {
        arg = args[parseInt(match[1], 10) - 1];
      } else {
        arg = args[cursor++];
      }
      if (React.isValidElement(arg)) {
        rv.push(React.cloneElement(arg, { key: idx }));
      } else {
        copyMatch[2] = null;
        copyMatch[1] = 1;
        rv.push(
          <span key={copyIdx++}>
            {sprintf.format([copyMatch], [null, arg])}
          </span>
        );
      }
    }
  });
  return rv;
}

export function hasReactArguments(args) {
  if (args.some(React.isValidElement)) {
    return true;
  }
  if (args.length === 1 && typeof args[0] === 'object') {
    const firstArg = args[0];
    return Object.keys(firstArg)
      .some(key => React.isValidElement(firstArg[key]));
  }
  return false;
}

export function format(formatString, args) {
  return hasReactArguments(args)
    ? formatForReact(formatString, args)
    : sprintf(formatString, ...args);
}
