import React from 'react';
import ErrorBoundary, { ErrorBoundaryProps } from 'react-error-boundary';
import SuperChart from './SuperChart';
import DefaultFallbackComponent from './FallbackComponent';
import ChartProps, { ChartPropsConfig } from '../models/ChartProps';
import { PreTransformProps, TransformProps, PostTransformProps } from '../types/TransformFunction';
import {
  HandlerFunction,
  SnakeCaseDatasource,
  SnakeCaseFormData,
  QueryData,
  Hooks,
  AnnotationData,
  Filters,
} from '../types/ChartProps';

const defaultProps = {
  FallbackComponent: DefaultFallbackComponent,
  height: 400,
  width: 'auto',
};

export type Props = {
  id?: string;
  className?: string;
  chartType: string;
  preTransformProps?: PreTransformProps;
  overrideTransformProps?: TransformProps;
  postTransformProps?: PostTransformProps;
  onRenderSuccess?: HandlerFunction;
  onRenderFailure?: HandlerFunction;
  chartProps: ChartPropsConfig | ChartProps;
  disableErrorBoundary?: boolean;
  FallbackComponent?: ErrorBoundaryProps['FallbackComponent'];
  onErrorBoundary?: ErrorBoundaryProps['onError'];
  height?: number | 'auto';
  width?: number | 'auto';

  /** Metadata of the datasource */
  datasource?: SnakeCaseDatasource;
  /** Main configuration for the chart */
  formData?: SnakeCaseFormData;
  /** Optional field for override hooks */
  hooks?: Hooks;
  /** Data for the chart  */
  payload?: QueryData;

  /** Legacy field:  */
  annotationData?: AnnotationData;
  /** Legacy field:  */
  filters?: Filters;
  /** Legacy hook:  */
  onAddFilter?: HandlerFunction;
  /** Legacy hook:  */
  onError?: HandlerFunction;
  /** Legacy hook:  */
  setControlValue?: HandlerFunction;
  /** Legacy hook:  */
  setTooltip?: HandlerFunction;
} & typeof defaultProps;

export default class SuperChartContainer extends React.PureComponent<Props, {}> {
  static defaultProps = defaultProps;

  createChartProps = ChartProps.createSelector();

  renderChart() {}

  renderResponsiveChart() {}

  render() {
    const {
      id,
      className,
      chartType,
      chartProps,
      preTransformProps,
      overrideTransformProps,
      postTransformProps,
      onRenderSuccess,
      onRenderFailure,
      disableErrorBoundary,
      FallbackComponent,
      onErrorBoundary,
      height,
      width,
    } = this.props;

    const component = (
      <SuperChart
        id={id}
        className={className}
        chartType={chartType}
        chartProps={this.createChartProps({ ...chartProps, height, width })}
        preTransformProps={preTransformProps}
        overrideTransformProps={overrideTransformProps}
        postTransformProps={postTransformProps}
        onRenderSuccess={onRenderSuccess}
        onRenderFailure={onRenderFailure}
      />
    );

    return disableErrorBoundary === true ? (
      component
    ) : (
      <ErrorBoundary
        FallbackComponent={FallbackComponent || DefaultFallbackComponent}
        onError={onErrorBoundary}
      >
        {component}
      </ErrorBoundary>
    );
  }
}
