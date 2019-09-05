import { isX, isY, isXY } from '../../src/typeGuards/Channel';

describe('type guards: Channel', () => {
  describe('isX(channelType)', () => {
    it('returns true if it is one of X channel types', () => {
      expect(isX('X')).toBeTruthy();
      expect(isX('XBand')).toBeTruthy();
    });
    it('returns false otherwise', () => {
      expect(isX('Color')).toBeFalsy();
    });
  });
  describe('isY(channelType)', () => {
    it('returns true if it is one of Y channel types', () => {
      expect(isY('Y')).toBeTruthy();
      expect(isY('YBand')).toBeTruthy();
    });
    it('returns false otherwise', () => {
      expect(isY('Color')).toBeFalsy();
    });
  });
  describe('isXY(channelType)', () => {
    it('returns true if it is one of X or Y channel types', () => {
      expect(isXY('X')).toBeTruthy();
      expect(isXY('XBand')).toBeTruthy();
      expect(isXY('Y')).toBeTruthy();
      expect(isXY('YBand')).toBeTruthy();
    });
    it('returns false otherwise', () => {
      expect(isXY('Color')).toBeFalsy();
    });
  });
});
