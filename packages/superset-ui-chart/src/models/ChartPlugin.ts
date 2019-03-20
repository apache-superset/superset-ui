import { FunctionComponent, ComponentType } from 'react';
import { isRequired, Plugin } from '@superset-ui/core';
import ChartMetadata from './ChartMetadata';
import getChartMetadataRegistry from '../registries/ChartMetadataRegistrySingleton';
import getChartBuildQueryRegistry from '../registries/ChartBuildQueryRegistrySingleton';
import getChartComponentRegistry from '../registries/ChartComponentRegistrySingleton';
import getChartTransformPropsRegistry from '../registries/ChartTransformPropsRegistrySingleton';
import { ChartFormData } from '../types/ChartFormData';
import { BuildQueryFunction, TransformProps } from '../types/Query';

const IDENTITY = (x: any) => x;

export type PromiseOrValue<T> = Promise<T> | T;
export type PromiseOrValueLoader<T> = () => PromiseOrValue<T>;

export type ChartType = ComponentType | FunctionComponent;

interface ChartPluginConfig<T extends ChartFormData> {
  metadata: ChartMetadata;
  // use buildQuery for immediate value
  buildQuery?: BuildQueryFunction<T>;
  // use loadBuildQuery for dynamic import (lazy-loading)
  loadBuildQuery?: PromiseOrValueLoader<BuildQueryFunction<T>>;
  // use transformProps for immediate value
  transformProps?: TransformProps;
  // use loadTransformProps for dynamic import (lazy-loading)
  loadTransformProps?: PromiseOrValueLoader<TransformProps>;
  // use Chart for immediate value
  Chart?: ChartType;
  // use loadChart for dynamic import (lazy-loading)
  loadChart?: PromiseOrValueLoader<ChartType>;
}

export default class ChartPlugin<T extends ChartFormData = ChartFormData> extends Plugin {
  metadata: ChartMetadata;
  loadBuildQuery?: PromiseOrValueLoader<BuildQueryFunction<T>>;
  loadTransformProps: PromiseOrValueLoader<TransformProps>;
  loadChart: PromiseOrValueLoader<ChartType>;

  constructor(config: ChartPluginConfig<T>) {
    super();
    const {
      metadata,
      buildQuery,
      loadBuildQuery,
      transformProps = IDENTITY,
      loadTransformProps,
      Chart,
      loadChart,
    } = config;
    this.metadata = metadata;
    this.loadBuildQuery = loadBuildQuery || (buildQuery ? () => buildQuery : undefined);
    this.loadTransformProps = loadTransformProps || (() => transformProps);

    if (loadChart) {
      this.loadChart = loadChart;
    } else if (Chart) {
      this.loadChart = () => Chart;
    } else {
      throw new Error('Chart or loadChart is required');
    }
  }

  register() {
    const { key = isRequired('config.key') } = this.config;
    getChartMetadataRegistry().registerValue(key, this.metadata);
    getChartComponentRegistry().registerLoader(key, this.loadChart);
    getChartTransformPropsRegistry().registerLoader(key, this.loadTransformProps);
    if (this.loadBuildQuery) {
      getChartBuildQueryRegistry().registerLoader(key, this.loadBuildQuery);
    }

    return this;
  }

  configure(config: { [key: string]: any }, replace?: boolean) {
    super.configure(config, replace);

    return this;
  }
}
