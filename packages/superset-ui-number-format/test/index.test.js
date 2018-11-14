import {
  formatNumber,
  Formats,
  getFormatter,
  getNumberFormatterRegistry,
  NumberFormatter,
  PREVIEW_VALUE,
} from '../src/index';

describe('index', () => {
  it('exports modules', () => {
    [
      formatNumber,
      Formats,
      getFormatter,
      getNumberFormatterRegistry,
      NumberFormatter,
      PREVIEW_VALUE,
    ].forEach(x => expect(x).toBeDefined());
  });
});
