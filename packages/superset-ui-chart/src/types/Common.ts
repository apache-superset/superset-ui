export type UnaryOperator = 'IS NOT NULL' | 'IS NULL';

export type BinaryOperator = '=' | '!=' | '>' | '<' | '>=' | '<=' | 'like' | 'regex';

export type SetOperator = 'in' | 'not in';

export type TimeRange =
  | {
      /** Time range of the query [from, to] */
      // eslint-disable-next-line camelcase
      time_range?: string;
    }
  | {
      since?: string;
      until?: string;
    };
