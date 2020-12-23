import { getTimeFormatter, getTimeFormatterForGranularity } from '@superset-ui/core';
import { cellFormat } from '../src/utils/formatCells';

describe('pivot table plugin format cells', () => {
  let i = 0;
  let cols = ['SUM'];
  let tdText = '2222222';
  let columnFormats = {};
  let numberFormat = 'SMART_NUMBER';
  let dateRegex = /^__timestamp:(-?\d*\.?\d*)$/;
  let dateFormatter = getTimeFormatterForGranularity('P1D');

  it('render number', () => {
    const { textContent, attr } = cellFormat(
      i,
      cols,
      tdText,
      columnFormats,
      numberFormat,
      dateRegex,
      dateFormatter,
    );
    expect(textContent).toEqual('2.22M');
    expect(attr).toEqual(('data-sort', 2222222));
  });

  it('render date', () => {
    tdText = '__timestamp:-126230400000.0';

    const { textContent, attr } = cellFormat(
      i,
      cols,
      tdText,
      columnFormats,
      numberFormat,
      dateRegex,
      dateFormatter,
    );
    expect(textContent).toEqual('1966-01-01');
  });

  it('render string', () => {
    tdText = 'some-text';

    const { textContent, attr } = cellFormat(
      i,
      cols,
      tdText,
      columnFormats,
      numberFormat,
      dateRegex,
      dateFormatter,
    );
    expect(textContent).toEqual(tdText);
    expect(attr).toEqual(('data-sort', tdText));
  });
});
