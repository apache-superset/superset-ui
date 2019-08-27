import { getSequentialSchemeRegistry, SequentialScheme } from '@superset-ui/color';
import createScaleFromScaleConfig from '../../../src/parsers/scale/createScaleFromScaleConfig';

describe('createScaleFromScaleConfig(config)', () => {
  describe('linear scale', () => {
    it('basic', () => {
      const scale = createScaleFromScaleConfig<number>({
        type: 'linear',
        domain: [0, 10],
        range: [0, 100],
      });
      expect(scale(10)).toEqual(100);
    });
    it('with reverse domain', () => {
      const scale = createScaleFromScaleConfig<number>({
        type: 'linear',
        domain: [0, 10],
        range: [0, 100],
        reverse: true,
      });
      expect(scale(10)).toEqual(0);
    });
    it('with color scheme as range', () => {
      getSequentialSchemeRegistry().registerValue(
        'test-scheme',
        new SequentialScheme({
          id: 'test-scheme',
          colors: ['#ff0000', '#ffff00'],
        }),
      );

      const scale = createScaleFromScaleConfig<number>({
        type: 'linear',
        domain: [0, 10],
        scheme: 'test-scheme',
      });

      expect(scale(0)).toEqual('rgb(255, 0, 0)');
      expect(scale(10)).toEqual('rgb(255, 255, 0)');

      getSequentialSchemeRegistry().remove('test-scheme');
    });
    it('with nice', () => {
      const scale = createScaleFromScaleConfig<number>({
        type: 'linear',
        domain: [0, 9.9],
        range: [0, 100],
        nice: true,
      });
      expect(scale(10)).toEqual(100);
    });
    it('with clamp', () => {
      const scale = createScaleFromScaleConfig<number>({
        type: 'linear',
        domain: [0, 10],
        range: [0, 100],
        clamp: true,
      });
      expect(scale(-10000)).toEqual(0);
      expect(scale(10000)).toEqual(100);
    });
    it('with round', () => {
      const scale = createScaleFromScaleConfig<number>({
        type: 'linear',
        domain: [0, 10],
        range: [0, 10],
        round: true,
      });
      expect(scale(9.9)).toEqual(10);
    });
  });

  describe('log scale', () => {
    it('basic', () => {
      const scale = createScaleFromScaleConfig<number>({
        type: 'log',
        domain: [1, 100],
        range: [1, 10],
        base: 10,
      });
      expect(scale(10)).toEqual(5.5);
      expect(scale(100)).toEqual(10);
    });
    it('with base', () => {
      const scale = createScaleFromScaleConfig<number>({
        type: 'log',
        domain: [1, 16],
        base: 2,
      });
      expect(scale(8)).toEqual(0.75);
    });
  });

  describe('power scale', () => {
    it('basic', () => {
      const scale = createScaleFromScaleConfig<number>({
        type: 'pow',
        domain: [0, 100],
      });
      expect(scale(10)).toEqual(0.1);
      expect(scale(100)).toEqual(1);
    });
    it('with exponent', () => {
      const scale = createScaleFromScaleConfig<number>({
        type: 'pow',
        exponent: 2,
      });
      expect(scale(3)).toEqual(9);
      expect(scale(4)).toEqual(16);
    });
  });

  describe('sqrt scale', () => {
    it('basic', () => {
      const scale = createScaleFromScaleConfig<number>({
        type: 'sqrt',
      });
      expect(scale(4)).toEqual(2);
      expect(scale(9)).toEqual(3);
    });
  });

  describe('symlog scale', () => {
    it('is not implemented yet', () => {
      expect(() => createScaleFromScaleConfig({ type: 'symlog' })).toThrowError(
        '"scale.type = symlog" is not implemented yet.',
      );
    });
  });

  describe('time scale', () => {
    it('basic', () => {
      const scale = createScaleFromScaleConfig<number>({
        type: 'time',
        domain: [
          {
            year: 2019,
            month: 7,
            date: 1,
          },
          {
            year: 2019,
            month: 7,
            date: 31,
          },
        ],
        range: [0, 100],
      });
      expect(scale(new Date(2019, 6, 1))).toEqual(0);
      expect(scale(new Date(2019, 6, 16))).toEqual(50);
      expect(scale(new Date(2019, 6, 31))).toEqual(100);
    });
  });

  describe('UTC scale', () => {
    it('basic', () => {
      const scale = createScaleFromScaleConfig<number>({
        type: 'utc',
        domain: [
          {
            year: 2019,
            month: 7,
            date: 1,
            utc: true,
          },
          {
            year: 2019,
            month: 7,
            date: 31,
            utc: true,
          },
        ],
        range: [0, 100],
      });
      expect(scale(new Date(Date.UTC(2019, 6, 1)))).toEqual(0);
      expect(scale(new Date(Date.UTC(2019, 6, 16)))).toEqual(50);
      expect(scale(new Date(Date.UTC(2019, 6, 31)))).toEqual(100);
    });
  });
});
