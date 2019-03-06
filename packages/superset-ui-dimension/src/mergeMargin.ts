import { Margin } from './types';

export default function mergeMargin(
  margin1: Partial<Margin> = {},
  margin2: Partial<Margin> = {},
  mode: 'expand' | 'shrink' = 'expand',
) {
  const { top = 0, left = 0, bottom = 0, right = 0 } = margin1;
  const { top: top2 = 0, left: left2 = 0, bottom: bottom2 = 0, right: right2 = 0 } = margin2;

  return mode === 'expand'
    ? {
        bottom: Math.max(bottom, bottom2),
        left: Math.max(left, left2),
        right: Math.max(right, right2),
        top: Math.max(top, top2),
      }
    : {
        bottom: Math.min(bottom, bottom2),
        left: Math.min(left, left2),
        right: Math.min(right, right2),
        top: Math.min(top, top2),
      };
}
