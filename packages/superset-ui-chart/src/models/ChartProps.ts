import { createSelector } from 'reselect';
import { convertKeysToCamelCase } from '@superset-ui/core';

interface PlainObject {
  [key: string]: any;
}

// TODO: more specific typing for these fields of ChartProps
type AnnotationData = PlainObject;
type CamelCaseDatasource = PlainObject;
type SnakeCaseDatasource = PlainObject;
type CamelCaseFormData = PlainObject;
type SnakeCaseFormData = PlainObject;
export type QueryData = PlainObject;
type Filters = any[];
type HandlerFunction = (...args: any[]) => void;
type ChartPropsSelector<Hooks extends PlainObject> = (c: ChartPropsConfig<Hooks>) => ChartProps;

interface ChartPropsConfig<Hooks> {
  annotationData?: AnnotationData;
  /**
   * Support programmatic hooks/overrides
   * such as tooltipRenderer, labelRenderer, legendRenderer
   * (only for advanced case that cannot be defined
   * in formData)
   */
  hooks?: Hooks;
  datasource?: SnakeCaseDatasource;
  filters?: Filters;
  /**
   * Only contains json-serializable data
   * Never store function(s) or class instances in formData
   */
  formData?: SnakeCaseFormData;
  height?: number;
  onAddFilter?: HandlerFunction;
  onError?: HandlerFunction;
  payload?: QueryData;
  setControlValue?: HandlerFunction;
  setTooltip?: HandlerFunction;
  width?: number;
}

function NOOP() {}

const DEFAULT_WIDTH = 800;
const DEFAULT_HEIGHT = 600;

export default class ChartProps<Hooks extends PlainObject = PlainObject> {
  static createSelector = function create<Hooks extends PlainObject>(): ChartPropsSelector<Hooks> {
    return createSelector(
      (input: ChartPropsConfig<Hooks>) => input.annotationData,
      input => input.hooks,
      input => input.datasource,
      input => input.filters,
      input => input.formData,
      input => input.height,
      input => input.onAddFilter,
      input => input.onError,
      input => input.payload,
      input => input.setControlValue,
      input => input.setTooltip,
      input => input.width,
      (
        annotationData,
        hooks,
        datasource,
        filters,
        formData,
        height,
        onAddFilter,
        onError,
        payload,
        setControlValue,
        setTooltip,
        width,
      ) =>
        new ChartProps({
          annotationData,
          datasource,
          filters,
          formData,
          height,
          hooks,
          onAddFilter,
          onError,
          payload,
          setControlValue,
          setTooltip,
          width,
        }),
    );
  };

  annotationData: AnnotationData;
  hooks: Hooks;
  datasource: CamelCaseDatasource;
  rawDatasource: SnakeCaseDatasource;
  filters: Filters;
  formData: CamelCaseFormData;
  rawFormData: SnakeCaseFormData;
  height: number;
  onAddFilter: HandlerFunction;
  onError: HandlerFunction;
  payload: QueryData;
  setControlValue: HandlerFunction;
  setTooltip: HandlerFunction;
  width: number;

  constructor(config: ChartPropsConfig<Hooks> = {}) {
    const {
      annotationData = {},
      hooks = {} as Hooks,
      datasource = {},
      filters = [],
      formData = {},
      onAddFilter = NOOP,
      onError = NOOP,
      payload = {},
      setControlValue = NOOP,
      setTooltip = NOOP,
      width = DEFAULT_WIDTH,
      height = DEFAULT_HEIGHT,
    } = config;
    this.width = width;
    this.height = height;
    this.annotationData = annotationData;
    this.hooks = hooks;
    this.datasource = convertKeysToCamelCase(datasource);
    this.rawDatasource = datasource;
    this.filters = filters;
    this.formData = convertKeysToCamelCase(formData);
    this.rawFormData = formData;
    this.onAddFilter = onAddFilter;
    this.onError = onError;
    this.payload = payload;
    this.setControlValue = setControlValue;
    this.setTooltip = setTooltip;
  }
}
