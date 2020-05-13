import { ControlGroups, ResidualFormData } from './types/QueryFormData';
import { GroupedControlData, ResidualGroupedControlData } from './types/ControlData';

export default function buildGroupedControlData(
  residualFormData: ResidualFormData,
  controlGroups?: ControlGroups,
): GroupedControlData & ResidualGroupedControlData {
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
  const groupedControls: GroupedControlData & ResidualGroupedControlData = {
    columns: [],
    groupby: [],
    metrics: [],
  };

  Object.entries(residualFormData).forEach(entry => {
    const [key, residualValue] = entry;
    if (Object.prototype.hasOwnProperty.call(defaultedControlGroups, key)) {
      const controlGroup: string = defaultedControlGroups[key];
      const controlValue = residualFormData[key];
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      groupedControls[controlGroup] = (groupedControls[controlGroup] || []).concat(controlValue);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      groupedControls[key] = (groupedControls[key] || []).concat(residualValue);
    }
  });
  return groupedControls;
}
