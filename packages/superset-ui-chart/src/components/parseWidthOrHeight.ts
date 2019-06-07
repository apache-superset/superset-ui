const HUNDRED_PERCENT = { isDynamic: true, percent: 100 } as const;

export default function parseWidthOrHeight(
  input: string | number,
): { isDynamic: true; percent: number } | { isDynamic: false; value: number } {
  if (input === 'auto' || input === '100%') {
    return HUNDRED_PERCENT;
  } else if (typeof input === 'string' && input.length > 0 && input[input.length - 1] === '%') {
    return { isDynamic: true, percent: parseFloat(input.substring(0, input.length - 1)) };
  }
  const value = typeof input === 'number' ? input : parseFloat(input);

  return { isDynamic: false, value };
}
