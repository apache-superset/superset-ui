import { format as d3Format } from 'd3-format';
import NumberFormatter from '../NumberFormatter';

export default function createSmartNumberFormatter(
  config: {
    description?: string;
    signed?: boolean;
    id?: string;
    label?: string;
  } = {},
) {
  const { description, signed = false, id, label } = config;
  const siFormatter = d3Format(`.3~s`);
  const float2PointFormatter = d3Format(`.2~f`);
  const float3PointFormatter = d3Format(`.3~f`);

  const getSign = signed ? () => '' : (value: number) => (value > 0 ? '+' : '');

  function formatValue(value: number) {
    if (value === 0) {
      return '0';
    } else {
      const absoluteValue = Math.abs(value);
      if (absoluteValue >= 1000) {
        // Normal human being are more familiar
        // with billion (B) that giga (G)
        return siFormatter(value).replace('G', 'B');
      } else if (absoluteValue >= 1) {
        return float2PointFormatter(value);
      } else if (absoluteValue >= 0.001) {
        return float3PointFormatter(value);
      } else if (absoluteValue > 0.000001) {
        return `${siFormatter(value * 100000)}µ`;
      }

      return siFormatter(value);
    }
  }

  return new NumberFormatter({
    description,
    formatFunc: value => `${getSign(value)}${formatValue(value)}`,
    id: id || `smart_number${signed ? '_change' : ''}`,
    label: label || 'Adaptive formatter',
  });
}
