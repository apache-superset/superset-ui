import { ControlGroups, QueryFormResidualData } from './types/QueryFormData';
import { GroupedControlData } from './types/ControlData';

export default function buildGroupedControlData(
  residualFormData: QueryFormResidualData,
  controlGroups?: ControlGroups,
) {
  const defaultedControlGroups: ControlGroups = {
    /** These are predefined for backward compatibility */
    metric: 'metrics',
    percent_metrics: 'metrics',
    metric_2: 'metrics',
    secondary_metric: 'metrics',
    x: 'metrics',
    y: 'metrics',
    size: 'metrics',
    ...controlGroups,
  };
  const groupedControls: GroupedControlData = {
    columns: [],
    groupby: [],
    metrics: [],
  };
  Object.entries(residualFormData).forEach(entry => {
    const [key, residualValue] = entry;
    const normalizedKey = Object.prototype.hasOwnProperty.call(defaultedControlGroups, key)
      ? defaultedControlGroups[key]
      : key;
    groupedControls[normalizedKey] = (groupedControls[normalizedKey] || []).concat(residualValue);
  });
  return groupedControls;
}
