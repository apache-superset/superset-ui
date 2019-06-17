import React from 'react';
import ErrorBoundary, { ErrorBoundaryProps, FallbackProps } from 'react-error-boundary';
import { parseLength } from '@superset-ui/dimension';
import { ParentSize } from '@vx/responsive';
import SuperChartCore, { Props as SuperChartCoreProps } from './SuperChartCore';
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

export type FallbackPropsWithDimension = FallbackProps & { width?: number; height?: number };

type WrapperProps = {
  disableErrorBoundary?: boolean;
  debounceTime?: number;
  FallbackComponent?: React.ComponentType<FallbackPropsWithDimension>;
  onErrorBoundary?: ErrorBoundaryProps['onError'];
  height?: number | string;
  width?: number | string;
};

/** SuperChart Props for version 0.11 and below has chartProps */
type ClassicProps = Omit<SuperChartCoreProps, 'chartProps'> & {
  chartProps?: ChartProps | ChartPropsConfig;
} & WrapperProps &
  Readonly<typeof defaultProps>;

/** A newer alternative now lists the fields that were inside chartProps as top-level fields */
type ModernProps = Omit<SuperChartCoreProps, 'chartProps'> &
  Omit<ChartPropsConfig, 'width' | 'height'> &
  WrapperProps &
  Readonly<typeof defaultProps>;

export type Props = ClassicProps | ModernProps;

function isClassicProps(props: Props): props is ClassicProps {
  return 'chartProps' in props;
}

function isModernProps(props: Props): props is ModernProps {
  return (
    'formData' in props ||
    'payload' in props ||
    'annotationData' in props ||
    'datasource' in props ||
    'filters' in props
  );
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
    const chart = (
      <SuperChartCore
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

    const { disableErrorBoundary, FallbackComponent, onErrorBoundary } = this.props;

    // Include the error boundary by default unless it is specifically disabled.
    return disableErrorBoundary === true ? (
      chart
    ) : (
      <ErrorBoundary
        FallbackComponent={(props: FallbackProps) => (
          <FallbackComponent width={width} height={height} {...props} />
        )}
        onError={onErrorBoundary}
      >
        {chart}
      </ErrorBoundary>
    );
  }

  render() {
    let inputWidth: string | number = DEFAULT_WIDTH;
    let inputHeight: string | number = DEFAULT_HEIGHT;

    // Check if the chartProps contain any width or height
    if ('chartProps' in this.props && typeof this.props.chartProps !== 'undefined') {
      const { width: w, height: h } = this.props.chartProps;
      if (typeof w !== 'undefined') {
        inputWidth = w;
      }
      if (typeof h !== 'undefined') {
        inputHeight = h;
      }
    }

    // Now check if there are props width or height,
    // which takes higher precedent than the ones inside chartProps
    if (typeof this.props.width !== 'undefined') {
      inputWidth = this.props.width;
    }
    if (typeof this.props.height !== 'undefined') {
      inputHeight = this.props.height;
    }

    // Parse them in case they are % or 'auto'
    const widthInfo = parseLength(inputWidth);
    const heightInfo = parseLength(inputHeight);

    // If any of the dimension is dynamic, get parent's dimension
    if (widthInfo.isDynamic || heightInfo.isDynamic) {
      const { debounceTime } = this.props;

      return (
        <ParentSize debounceTime={debounceTime}>
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
}
