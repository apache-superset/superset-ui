import createD3TimeFormatter from '../../src/factories/createD3TimeFormatter';
import { PREVIEW_TIME } from '../../src/TimeFormatter';
import { TimeFormats } from '../../src';

describe('createD3TimeFormatter(config)', () => {
  describe('if config.useLocalTime is true', () => {
    it('formats in local time', () => {
      const formatter = createD3TimeFormatter({
        formatString: TimeFormats.DATABASE_DATETIME,
        useLocalTime: true,
      });
      const offset = new Date().getTimezoneOffset();
      if (offset === 0) {
        expect(formatter.format(PREVIEW_TIME)).toEqual('2017-02-14 11:22:33');
      } else {
        expect(formatter.format(PREVIEW_TIME)).not.toEqual('2017-02-14 11:22:33');
      }
    });
  });
  describe('if config.useLocalTime is false', () => {
    it('formats in UTC time', () => {
      const formatter = createD3TimeFormatter({
        formatString: TimeFormats.DATABASE_DATETIME,
      });
      expect(formatter.format(PREVIEW_TIME)).toEqual('2017-02-14 11:22:33');
    });
  });
  describe('config.locale', () => {
    it('supports locale customization', () => {
      const formatter = createD3TimeFormatter({
        description: 'lorem ipsum',
        formatString: '%A %d %B %Y',
        locale: {
          dateTime: '%a %b %e %X %Y',
          date: '%d/%m/%Y',
          time: '%H:%M:%S',
          periods: ['AM', 'PM'],
          days: [
            'วันอาทิตย์',
            'วันจันทร์',
            'วันอังคาร',
            'วันพุธ',
            'วันพฤหัส',
            'วันศุกร์',
            'วันเสาร์',
          ],
          shortDays: ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ', 'ศ.', 'ส.'],
          months: [
            'มกราคม',
            'กุมภาพันธ์',
            'มีนาคม',
            'เมษายน',
            'พฤษภาคม',
            'มิถุนายน',
            'กรกฎาคม',
            'สิงหาคม',
            'กันยายน',
            'ตุลาคม',
            'พฤศจิกายน',
            'ธันวาคม',
          ],
          shortMonths: [
            'ม.ค.',
            'ก.พ.',
            'มี.ค.',
            'เม.ย.',
            'พ.ค.',
            'มิ.ย.',
            'ก.ค.',
            'ส.ค.',
            'ก.ย.',
            'ต.ค.',
            'พ.ย.',
            'ธ.ค.',
          ],
        },
      });
      expect(formatter(new Date(Date.UTC(2015, 11, 20)))).toEqual('วันอาทิตย์ 20 ธันวาคม 2015');
    });
  });
});
