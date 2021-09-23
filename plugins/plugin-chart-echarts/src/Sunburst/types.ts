import { QueryFormData } from '@superset-ui/core';

export type EchartsSunburstFormData = QueryFormData & {
  colorScheme?: string;
  innerRadius: number;
  outerRadius: number;
  rotateLabel: string;
  labelMinAngle: number;
  showLabel: boolean;
  labelPosition: string;
  labelDistance: number;
  labelType: string;
};

export const DEFAULT_FORM_DATA: EchartsSunburstFormData = {
  innerRadius: 30,
  outerRadius: 70,
  rotateLabel: 'radial',
  labelMinAngle: 0,
  showLabel: true,
  labelPosition: 'inside',
  labelDistance: 5,
  labelType: 'key',
};

export enum EchartsSunburstLabelType {
  Key = 'key',
  Value = 'value',
  KeyValue = 'key_value',
}
