interface PlainObject {
  [key: string]: any;
}

// TODO: more specific typing for these fields of ChartProps
export type AnnotationData = PlainObject;
export type CamelCaseDatasource = PlainObject;
export type SnakeCaseDatasource = PlainObject;
export type CamelCaseFormData = PlainObject;
export type SnakeCaseFormData = PlainObject;
export type QueryData = PlainObject;
export type Filters = any[];
export type HandlerFunction = (...args: any[]) => void;
export type Hooks = PlainObject;
