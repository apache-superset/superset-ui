const HUNDRED_PERCENT = { percent: 100 };

export default function parseWidthOrHeight(input: string | number) {
  if (input === 'auto') {
    return HUNDRED_PERCENT;
  } else if (typeof input === 'string' && input.length > 0 && input[input.length - 1] === '%') {
    return { percent: parseFloat(input.substring(0, input.length - 1)) };
  }
  const value = typeof input === 'number' ? input : parseFloat(input);

  return { value };
}
