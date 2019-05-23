import { UnaryOperator, BinaryOperator, SetOperator } from './Operator';

interface BaseSimpleAdhocFilter {
  expressionType: 'SIMPLE';
  clause: 'WHERE' | 'HAVING';
  subject: string;
}

export type UnaryAdhocFilter = BaseSimpleAdhocFilter & {
  operator: UnaryOperator;
};

export type BinaryAdhocFilter = BaseSimpleAdhocFilter & {
  operator: BinaryOperator;
  comparator: string;
};

export type SetAdhocFilter = BaseSimpleAdhocFilter & {
  operator: SetOperator;
  comparator: string[];
};

export type SimpleAdhocFilter = UnaryAdhocFilter | BinaryAdhocFilter | SetAdhocFilter;

export interface FreeFormAdhocFilter {
  expressionType: 'SQL';
  clause: 'WHERE' | 'HAVING';
  sqlExpression: string;
}

export type AdhocFilter = SimpleAdhocFilter | FreeFormAdhocFilter;
