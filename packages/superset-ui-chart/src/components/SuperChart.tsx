import React from 'react';
import ErrorBoundary, { ErrorBoundaryProps } from 'react-error-boundary';
import { ParentSize } from '@vx/responsive';
import SuperChartKernel, { SuperChartKernelProps } from './SuperChartKernel';
import DefaultFallbackComponent from './FallbackComponent';
import ChartProps, { ChartPropsConfig } from '../models/ChartProps';
import parseWidthOrHeight from './parseWidthOrHeight';

// Only use these two when both top-level props
// and inside chartProps are not specified
// so they are not included in defaultProps
const DEFAULT_HEIGHT = 400;
const DEFAULT_WIDTH = '100%';

const defaultProps = {
  FallbackComponent: DefaultFallbackComponent,
};

type WrapperProps = {
  disableErrorBoundary?: boolean;
  FallbackComponent?: ErrorBoundaryProps['FallbackComponent'];
  onErrorBoundary?: ErrorBoundaryProps['onError'];
  height?: number | string;
  width?: number | string;
};

/** SuperChart Props for version 0.11 and below */
type ClassicProps = Omit<SuperChartKernelProps, 'chartProps'> & {
  chartProps?: ChartProps | ChartPropsConfig;
} & WrapperProps &
  Readonly<typeof defaultProps>;

/** SuperChart Props */
type ModernProps = Omit<SuperChartKernelProps, 'chartProps'> &
  Omit<
    ChartPropsConfig,
    'width' | 'height' | 'onAddFilter' | 'onError' | 'setControlValue' | 'setTooltip'
  > &
  WrapperProps &
  Readonly<typeof defaultProps>;

export type Props = ClassicProps | ModernProps;

function isClassicProps(props: Props): props is ClassicProps {
  return 'chartProps' in props;
}

function isModernProps(props: Props): props is ModernProps {
  return 'formData' in props || 'payload' in props;
}

export default class SuperChart extends React.PureComponent<Props, {}> {
  static defaultProps = defaultProps;

  createChartProps = ChartProps.createSelector();

  getChartPropsConfig() {
    if (isClassicProps(this.props)) {
      return this.props.chartProps;
    }
    if (isModernProps(this.props)) {
      const { annotationData, datasource, filters, formData, hooks, payload } = this.props;

      return {
        annotationData,
        datasource,
        filters,
        formData,
        hooks,
        payload,
      };
    }

    return {};
  }

  renderChart(width: number, height: number) {
    const {
      id,
      className,
      chartType,
      preTransformProps,
      overrideTransformProps,
      postTransformProps,
      onRenderSuccess,
      onRenderFailure,
    } = this.props;

    const chartPropsConfig = this.getChartPropsConfig();

    return (
      <SuperChartKernel
        id={id}
        className={className}
        chartType={chartType}
        chartProps={this.createChartProps({ ...chartPropsConfig, height, width })}
        preTransformProps={preTransformProps}
        overrideTransformProps={overrideTransformProps}
        postTransformProps={postTransformProps}
        onRenderSuccess={onRenderSuccess}
        onRenderFailure={onRenderFailure}
      />
    );
  }

  renderResponsiveChart() {
    let inputWidth: string | number = DEFAULT_WIDTH;
    let inputHeight: string | number = DEFAULT_HEIGHT;

    // Check if the chartProps contain any width or height
    if ('chartProps' in this.props) {
      const { width: w = undefined, height: h = undefined } = this.props.chartProps || {};
      if (typeof w !== 'undefined') {
        inputWidth = w;
      }
      if (typeof h !== 'undefined') {
        inputHeight = h;
      }
    }

    // Now check if there are props width or height,
    // which takes higher precedent
    const { width: w2, height: h2 } = this.props;
    if (typeof w2 !== 'undefined') {
      inputWidth = w2;
    }
    if (typeof h2 !== 'undefined') {
      inputHeight = h2;
    }

    // Parse them in case they are % or 'auto'
    const widthInfo = parseWidthOrHeight(inputWidth);
    const heightInfo = parseWidthOrHeight(inputHeight);

    // If any of the dimension is dynamic, get parent's dimension
    if (widthInfo.isDynamic || heightInfo.isDynamic) {
      return (
        <ParentSize>
          {({ width, height }) =>
            width > 0 &&
            height > 0 &&
            this.renderChart(
              widthInfo.isDynamic ? Math.floor(width * widthInfo.multiplier) : widthInfo.value,
              heightInfo.isDynamic ? Math.floor(height * heightInfo.multiplier) : heightInfo.value,
            )
          }
        </ParentSize>
      );
    }

    return this.renderChart(widthInfo.value, heightInfo.value);
  }

  render() {
    const { disableErrorBoundary, FallbackComponent, onErrorBoundary } = this.props;

    const component = this.renderResponsiveChart();

    return disableErrorBoundary === true ? (
      component
    ) : (
      <ErrorBoundary FallbackComponent={FallbackComponent} onError={onErrorBoundary}>
        {component}
      </ErrorBoundary>
    );
  }
}
