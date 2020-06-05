import { FilterXSS, getDefaultWhiteList } from 'xss';
import { DataRecordValue } from '@superset-ui/chart';
import { DataColumnMeta } from '../types';

const xss = new FilterXSS({
  whiteList: {
    ...getDefaultWhiteList(),
    span: ['style', 'title'],
    div: ['style'],
    a: ['style'],
    img: ['style', 'src', 'alt', 'title', 'width', 'height'],
  },
  stripIgnoreTag: true,
  css: false,
});

function isProbablyHTML(text: string) {
  return /<[^>]+>/.test(text);
}
/**
 * Format text for cell value
 */
export default function formatValue(
  { formatter }: DataColumnMeta,
  value: DataRecordValue,
): [boolean, string] {
  if (value === null) {
    return [false, 'N/A'];
  }
  if (formatter) {
    // in case percent metric can specify percent format in the future
    return [false, formatter(value as number)];
  }
  if (typeof value === 'string') {
    const htmlText = xss.process(value);
    return isProbablyHTML(htmlText) ? [true, htmlText] : [false, value];
  }
  return [false, value.toString()];
}
