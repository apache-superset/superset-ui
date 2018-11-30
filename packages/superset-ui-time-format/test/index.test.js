import {
  createD3TimeFormatter,
  createMultiFormatter,
  formatTime,
  getTimeFormatter,
  getTimeFormatterRegistry,
  PREVIEW_TIME,
  smartDateFormatter,
  smartDateVerboseFormatter,
  TimeFormats,
  TimeFormatter,
} from '../src/index';

describe('index', () => {
  it('exports modules', () => {
    [
      createD3TimeFormatter,
      createMultiFormatter,
      formatTime,
      getTimeFormatter,
      getTimeFormatterRegistry,
      PREVIEW_TIME,
      smartDateFormatter,
      smartDateVerboseFormatter,
      TimeFormats,
      TimeFormatter,
    ].forEach(x => expect(x).toBeDefined());
  });
});
