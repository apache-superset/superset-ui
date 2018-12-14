import * as React from 'react';
import { createSelector } from 'reselect';
import getChartComponentRegistry from '../registries/ChartBuildQueryRegistrySingleton';
import getChartTransformPropsRegistry from '../registries/ChartTransformPropsRegistrySingleton';
import { ChartProps } from '../models/ChartProps';
import createLoadableRenderer, { LoadableRenderer } from './createLoadableRenderer';

const IDENTITY = (x: any) => x;

const EMPTY = () => null;

/* eslint-disable sort-keys */
const defaultProps = {
  id: '',
  className: '',
  preTransformProps: IDENTITY,
  overrideTransformProps: undefined,
  postTransformProps: IDENTITY,
  onRenderSuccess() {},
  onRenderFailure() {},
};
/* eslint-enable sort-keys */

type TransformFunction = (x: any) => any;
type HandlerFunction = (...args: any[]) => void;

interface LoadingProps {
  error: any;
}

interface LoadedModules {
  Chart: React.Component | { default: React.Component };
  transformProps: TransformFunction | { default: TransformFunction };
}

interface RenderProps {
  chartProps: ChartProps;
  preTransformProps?: TransformFunction;
  postTransformProps?: TransformFunction;
}

export interface SuperChartProps {
  id?: string;
  className?: string;
  chartProps: ChartProps;
  chartType: string;
  preTransformProps?: TransformFunction;
  overrideTransformProps?: TransformFunction;
  postTransformProps?: TransformFunction;
  onRenderSuccess?: HandlerFunction;
  onRenderFailure?: HandlerFunction;
}

function getModule<T>(value: any): T {
  return (value.default ? value.default : value) as T;
}

class SuperChart extends React.PureComponent<SuperChartProps, {}> {
  static defaultProps = defaultProps;

  constructor(props: SuperChartProps) {
    super(props);

    this.renderChart = this.renderChart.bind(this);
    this.renderLoading = this.renderLoading.bind(this);

    // memoized function so it will not recompute
    // and return previous value
    // unless one of
    // - preTransformProps
    // - transformProps
    // - postTransformProps
    // - chartProps
    // is changed.
    this.processChartProps = createSelector(
      input => input.preTransformProps,
      input => input.transformProps,
      input => input.postTransformProps,
      input => input.chartProps,
      (pre = IDENTITY, transform = IDENTITY, post = IDENTITY, chartProps) =>
        post(transform(pre(chartProps))),
    );

    const componentRegistry = getChartComponentRegistry();
    const transformPropsRegistry = getChartTransformPropsRegistry();

    // memoized function so it will not recompute
    // and return previous value
    // unless one of
    // - chartType
    // - overrideTransformProps
    // is changed.
    this.createLoadableRenderer = createSelector(
      input => input.chartType,
      input => input.overrideTransformProps,
      (chartType, overrideTransformProps) => {
        if (chartType) {
          const Renderer = createLoadableRenderer({
            loader: {
              Chart: () => componentRegistry.getAsPromise(chartType),
              transformProps: overrideTransformProps
                ? () => Promise.resolve(overrideTransformProps)
                : () => transformPropsRegistry.getAsPromise(chartType),
            },
            loading: (loadingProps: LoadingProps) => this.renderLoading(loadingProps, chartType),
            render: this.renderChart,
          });

          // Trigger preloading.
          Renderer.preload();

          return Renderer;
        }

        return EMPTY;
      },
    );
  }

  processChartProps: (
    input: {
      chartProps: ChartProps;
      preTransformProps?: TransformFunction;
      transformProps?: TransformFunction;
      postTransformProps?: TransformFunction;
    },
  ) => any;

  createLoadableRenderer: (
    input: {
      chartType: string;
      overrideTransformProps?: TransformFunction;
    },
  ) => LoadableRenderer<RenderProps, LoadedModules> | (() => null);

  renderChart(loaded: LoadedModules, props: RenderProps) {
    const Chart = getModule<typeof React.Component>(loaded.Chart);
    const transformProps = getModule<TransformFunction>(loaded.transformProps);
    const { chartProps, preTransformProps, postTransformProps } = props;

    return (
      <Chart
        {...this.processChartProps({
          /* eslint-disable sort-keys */
          chartProps,
          preTransformProps,
          transformProps,
          postTransformProps,
          /* eslint-enable sort-keys */
        })}
      />
    );
  }

  renderLoading(loadingProps: LoadingProps, chartType: string) {
    const { error } = loadingProps;

    if (error) {
      return (
        <div className="alert alert-warning" role="alert">
          <strong>ERROR</strong>&nbsp;
          <code>chartType=&quot;{chartType}&quot;</code> &mdash;
          {JSON.stringify(error)}
        </div>
      );
    }

    return null;
  }

  render() {
    const {
      id,
      className,
      preTransformProps,
      postTransformProps,
      chartProps,
      onRenderSuccess,
      onRenderFailure,
    } = this.props;

    // Create LoadableRenderer and start preloading
    // the lazy-loaded Chart components
    const Renderer = this.createLoadableRenderer(this.props);

    // Do not render if chartProps is not available.
    // but the pre-loading has been started in this.createLoadableRenderer
    // to prepare for rendering once chartProps becomes available.
    if (!chartProps) {
      return null;
    }

    return (
      <div id={id} className={className}>
        <Renderer
          preTransformProps={preTransformProps}
          postTransformProps={postTransformProps}
          chartProps={chartProps}
          onRenderSuccess={onRenderSuccess}
          onRenderFailure={onRenderFailure}
        />
      </div>
    );
  }
}

export default SuperChart;
