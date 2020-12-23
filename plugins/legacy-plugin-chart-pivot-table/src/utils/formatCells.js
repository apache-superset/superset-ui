import { formatNumber } from '@superset-ui/core';

function cellFormat(i, cols, tdText, columnFormats, numberFormat, dateRegex, dateFormatter) {
  const metric = cols[i];
  const format = columnFormats[metric] || numberFormat || '.3s';
  const parsedValue = parseFloat(tdText);
  var textContent, attr;

  if (Number.isNaN(parsedValue)) {
    const regexMatch = dateRegex.exec(tdText);
    if (regexMatch) {
      const date = new Date(parseFloat(regexMatch[1]));
      textContent = dateFormatter(date);
      attr = ('data-sort', date);
    } else {
      textContent = tdText;
      attr = ('data-sort', tdText);
    }
  } else {
    textContent = formatNumber(format, parsedValue);
    attr = ('data-sort', parsedValue);
  }
  return { textContent: textContent, attr: attr };
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
