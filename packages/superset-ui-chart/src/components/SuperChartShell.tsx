import React from 'react';
import ErrorBoundary, { ErrorBoundaryProps } from 'react-error-boundary';
import { parseLength } from '@superset-ui/dimension';
import { ParentSize } from '@vx/responsive';
import SuperChartKernel, { Props as SuperChartKernelProps } from './SuperChartKernel';
import DefaultFallbackComponent from './FallbackComponent';
import ChartProps, { ChartPropsConfig } from '../models/ChartProps';

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

/** SuperChart Props for version 0.11 and below has chartProps */
type ClassicProps = Omit<SuperChartKernelProps, 'chartProps'> & {
  chartProps?: ChartProps | ChartPropsConfig;
} & WrapperProps &
  Readonly<typeof defaultProps>;

/** A newer alternative now lists the fields that were inside chartProps as top-level fields */
type ModernProps = Omit<SuperChartKernelProps, 'chartProps'> &
  Omit<ChartPropsConfig, 'width' | 'height'> &
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

  private createChartProps = ChartProps.createSelector();

  private getChartPropsConfig() {
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
    const widthInfo = parseLength(inputWidth);
    const heightInfo = parseLength(inputHeight);

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

    // Include the error boundary by default unless it is specifically disabled.
    return disableErrorBoundary === true ? (
      component
    ) : (
      <ErrorBoundary FallbackComponent={FallbackComponent} onError={onErrorBoundary}>
        {component}
      </ErrorBoundary>
    );
  }
}
