import { getTimeFormatterForGranularity } from '@superset-ui/core';
import { cellFormat } from '../src/utils/formatCells';

describe('pivot table plugin format cells', () => {
  const i = 0;
  const cols = ['SUM'];
  let tdText = '2222222';
  const columnFormats = {};
  const numberFormat = 'SMART_NUMBER';
  const dateRegex = /^__timestamp:(-?\d*\.?\d*)$/;
  const dateFormatter = getTimeFormatterForGranularity('P1D');

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

    const { textContent } = cellFormat(
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
