import { createSelector } from 'reselect';
import { convertKeysToCamelCase } from '@superset-ui/core';
import {
  AnnotationData,
  SnakeCaseDatasource,
  Filters,
  SnakeCaseFormData,
  Hooks,
  HandlerFunction,
  QueryData,
  CamelCaseDatasource,
  CamelCaseFormData,
} from '../types/ChartProps';

type ChartPropsSelector = (c: ChartPropsConfig) => ChartProps;

export interface ChartPropsConfig {
  /** Metadata of the datasource */
  datasource?: SnakeCaseDatasource;
  /** Main configuration for the chart */
  formData?: SnakeCaseFormData;
  /** Data for the chart  */
  payload?: QueryData;
  /** Optional field for override hooks */
  hooks?: Hooks;

  /** Chart width */
  width?: number;
  /** Chart height */
  height?: number;

  /** Legacy field:  */
  annotationData?: AnnotationData;
  /** Legacy field: initial values for filter_box */
  filters?: Filters;

  /** Legacy hook:  */
  onAddFilter?: HandlerFunction;
  /** Legacy hook:  */
  onError?: HandlerFunction;
  /** Legacy hook:  */
  setControlValue?: HandlerFunction;
  /** Legacy hook:  */
  setTooltip?: HandlerFunction;
}

function NOOP() {}

const DEFAULT_WIDTH = 800;
const DEFAULT_HEIGHT = 600;

export default class ChartProps {
  static createSelector: () => ChartPropsSelector;

  annotationData: AnnotationData;
  datasource: CamelCaseDatasource;
  rawDatasource: SnakeCaseDatasource;
  filters: Filters;
  formData: CamelCaseFormData;
  rawFormData: SnakeCaseFormData;
  height: number;
  hooks: Hooks;
  onAddFilter: HandlerFunction;
  onError: HandlerFunction;
  payload: QueryData;
  setControlValue: HandlerFunction;
  setTooltip: HandlerFunction;
  width: number;

  constructor(config: ChartPropsConfig = {}) {
    const {
      annotationData = {},
      datasource = {},
      filters = [],
      formData = {},
      hooks = {},
      payload = {},
      width = DEFAULT_WIDTH,
      height = DEFAULT_HEIGHT,
    } = config;

    this.width = width;
    this.height = height;
    this.annotationData = annotationData;
    this.datasource = convertKeysToCamelCase(datasource);
    this.rawDatasource = datasource;
    this.filters = filters;
    this.formData = convertKeysToCamelCase(formData);
    this.hooks = hooks;
    this.rawFormData = formData;
    this.payload = payload;

    // These fields should be killed when we are ready to make breaking changes.
    // They are the original hooks for use in main Superset app.
    // Right now we provide backward compatibility by also exposing as top level fields
    // The preferred way is to nest them under hooks.
    const onAddFilter = hooks.onAddFilter || config.onAddFilter || NOOP;
    const onError = hooks.onError || config.onError || NOOP;
    const setControlValue = hooks.setControlValue || config.setControlValue || NOOP;
    const setTooltip = hooks.setTooltip || config.setTooltip || NOOP;
    this.onAddFilter = onAddFilter;
    this.onError = onError;
    this.setControlValue = setControlValue;
    this.setTooltip = setTooltip;
  }
}

ChartProps.createSelector = function create(): ChartPropsSelector {
  return createSelector(
    (input: ChartPropsConfig) => input.annotationData,
    input => input.datasource,
    input => input.filters,
    input => input.formData,
    input => input.height,
    input => input.hooks,
    input => input.onAddFilter,
    input => input.onError,
    input => input.payload,
    input => input.setControlValue,
    input => input.setTooltip,
    input => input.width,
    (
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
