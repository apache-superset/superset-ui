import D3TimeFormatter from '../../src/formatters/D3TimeFormatter';
import { PREVIEW_TIME } from '../../src/TimeFormatter';
import { TimeFormats } from '../../src';

describe('D3TimeFormatter', () => {
  describe('new D3TimeFormatter(config)', () => {
    it('requires configOrFormatString', () => {
      expect(() => new D3TimeFormatter()).toThrow();
    });
    describe('if configOrFormatString is string', () => {
      describe('uses the input as d3.format string', () => {
        it('if input starts with "local!", pass the rest of input after ! to d3.timeFormat and formats in local time', () => {
          const formatter = new D3TimeFormatter(`local!${TimeFormats.DATABASE_DATETIME}`);
          const offset = new Date().getTimezoneOffset();
          if (offset === 0) {
            expect(formatter.format(PREVIEW_TIME)).toEqual('2017-02-14 11:22:33');
          } else {
            expect(formatter.format(PREVIEW_TIME)).not.toEqual('2017-02-14 11:22:33');
          }
        });
        it('otherwise, formats in UTC by default', () => {
          const formatter = new D3TimeFormatter(TimeFormats.DATABASE_DATETIME);
          expect(formatter.format(PREVIEW_TIME)).toEqual('2017-02-14 11:22:33');
        });
      });
    });
    describe('if configOrFormatString is not string', () => {
      describe('config.id', () => {
        it('is required', () => {
          expect(() => new D3TimeFormatter({})).toThrow();
        });
        it('if config.id starts with "local!", pass the rest of input after ! to d3.timeFormat and formats in local time', () => {
          const formatter = new D3TimeFormatter({
            id: `local!${TimeFormats.DATABASE_DATETIME}`,
          });
          const offset = new Date().getTimezoneOffset();
          if (offset === 0) {
            expect(formatter.format(PREVIEW_TIME)).toEqual('2017-02-14 11:22:33');
          } else {
            expect(formatter.format(PREVIEW_TIME)).not.toEqual('2017-02-14 11:22:33');
          }
        });
        it('otherwise, formats in UTC by default', () => {
          const formatter = new D3TimeFormatter({ id: TimeFormats.DATABASE_DATETIME });
          expect(formatter.format(PREVIEW_TIME)).toEqual('2017-02-14 11:22:33');
        });
      });
    });
  });
});
