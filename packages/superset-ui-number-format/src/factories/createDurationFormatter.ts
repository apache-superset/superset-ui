import prettyMsFormatter from 'pretty-ms';
import NumberFormatter from '../NumberFormatter';
import NumberFormats from '../NumberFormats';

export default function createDurationFormatter(
  config: {
    description?: string;
    id?: string;
    label?: string;
    multiplier?: number;
  } = {},
) {
  const { description, id, label, multiplier = 1 } = config;

  return new NumberFormatter({
    description,
    formatFunc: value => prettyMsFormatter(value * multiplier),
    id: id || NumberFormats.DURATION,
    label: label || `Duration formatter`,
  });
}
