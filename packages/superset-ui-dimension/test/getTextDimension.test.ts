import { getTextDimension } from '../src/index';
import addDummyFill from './addDummyFill';

describe('getTextDimension(input)', () => {
  describe('returns default dimension if getBBox() is not available', () => {
    it('returns default value for default dimension', () => {
      expect(
        getTextDimension({
          text: 'sample text',
        }),
      ).toEqual({
        height: 20,
        width: 100,
      });
    });
    it('return specified value if specified', () => {
      expect(
        getTextDimension(
          {
            text: 'sample text',
          },
          {
            height: 30,
            width: 400,
          },
        ),
      ).toEqual({
        height: 30,
        width: 400,
      });
    });
  });
  describe('returns dimension of the given text', () => {
    let originalFn: () => DOMRect;

    beforeEach(() => {
      // @ts-ignore - fix jsdom
      originalFn = SVGElement.prototype.getBBox;
      addDummyFill();
    });

    afterEach(() => {
      // @ts-ignore - fix jsdom
      SVGElement.prototype.getBBox = originalFn;
    });

    it('takes text as argument', () => {
      expect(
        getTextDimension({
          text: 'sample text',
        }),
      ).toEqual({
        height: 20,
        width: 200,
      });
    });
    it('accepts provided class via className', () => {
      expect(
        getTextDimension({
          text: 'sample text',
          className: 'test-class',
        }),
      ).toEqual({
        height: 20,
        width: 100,
      });
    });
    it('accepts provided style.font', () => {
      expect(
        getTextDimension({
          text: 'sample text',
          style: {
            font: 'italic 700 30px Lobster',
          },
        }),
      ).toEqual({
        height: 30,
        width: 1125,
      });
    });
    it('accepts provided style.fontFamily', () => {
      expect(
        getTextDimension({
          text: 'sample text',
          style: {
            fontFamily: 'Lobster',
          },
        }),
      ).toEqual({
        height: 20,
        width: 250,
      });
    });
    it('accepts provided style.fontSize', () => {
      expect(
        getTextDimension({
          text: 'sample text',
          style: {
            fontSize: '40px',
          },
        }),
      ).toEqual({
        height: 40,
        width: 400,
      });
    });
    it('accepts provided style.fontStyle', () => {
      expect(
        getTextDimension({
          text: 'sample text',
          style: {
            fontStyle: 'italic',
          },
        }),
      ).toEqual({
        height: 20,
        width: 300,
      });
    });
    it('accepts provided style.fontWeight', () => {
      expect(
        getTextDimension({
          text: 'sample text',
          style: {
            fontWeight: 700,
          },
        }),
      ).toEqual({
        height: 20,
        width: 400,
      });
    });
    it('accepts provided style.letterSpacing', () => {
      expect(
        getTextDimension({
          text: 'sample text',
          style: {
            letterSpacing: '1.1',
          },
        }),
      ).toEqual({
        height: 20,
        width: 221,
      });
    });
  });
});
