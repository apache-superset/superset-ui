import { QueryFormData } from '@superset-ui/core';

export enum EchartsSunburstLabelType {
  Key = 'key',
  Value = 'value',
  KeyValue = 'key_value',
}

export type Node = {
  name: string;
  children: Node[];
  value?: number;
  level?: number;
};

export type EchartsSunburstFormData = QueryFormData & {
  colorScheme?: string;
  innerRadius: number;
  outerRadius: number;
  rotateLabel: 'radial' | 'tangential';
  labelMinAngle: number;
  showLabel: boolean;
  labelPosition: 'top' | 'left' | 'right' | 'bottom' | 'inside' | 'outside';
  labelDistance: number;
  labelType: EchartsSunburstLabelType;
};

// @ts-ignore
export const DEFAULT_FORM_DATA: EchartsSunburstFormData = {
  innerRadius: 30,
  outerRadius: 70,
  rotateLabel: 'radial',
  labelMinAngle: 0,
  showLabel: true,
  labelPosition: 'inside',
  labelDistance: 5,
  labelType: EchartsSunburstLabelType.Key,
};
