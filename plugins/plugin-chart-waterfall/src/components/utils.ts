// eslint-disable-next-line import/prefer-default-export
export const valueFormatter = (value: number) => {
  if (Math.abs(Math.round(value / 1000000)) >= 1) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (Math.abs(Math.round(value / 1000)) >= 1) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return `${value}`;
};
