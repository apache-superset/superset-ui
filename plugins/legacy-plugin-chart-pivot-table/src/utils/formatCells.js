import { formatNumber } from '@superset-ui/core';

function cellFormat(i, cols, tdText, columnFormats, numberFormat, dateRegex, dateFormatter) {
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

function cellDateFormat(text, verboseMap, dateRegex, dateFormatter) {
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

export { cellFormat, cellDateFormat };
