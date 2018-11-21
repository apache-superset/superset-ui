import { utcFormat, timeFormat } from 'd3-time-format';
import { isRequired } from '@superset-ui/core';
import TimeFormatter from '../TimeFormatter';

export default function createD3TimeFormatter({
  description,
  formatString = isRequired('formatString'),
  label,
  useLocalTime = false,
}) {
  const id = useLocalTime ? `local!${formatString}` : formatString;
  const format = useLocalTime ? timeFormat : utcFormat;
  const formatFunc = format(formatString);

  return new TimeFormatter({
    description,
    formatFunc,
    id,
    label,
    useLocalTime,
  });
}
