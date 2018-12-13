import React from 'react';

export type ReactifyProps = {
  id: string;
  className?: string;
};

export interface RenderFuncType<Props extends object> {
  (container: HTMLDivElement, props: Props & ReactifyProps): void;
  displayName?: string;
  defaultProps?: Partial<Props>;
  propTypes?: { [key: string]: any };
}

export default function reactify<Props extends object>(
  renderFn: RenderFuncType<Props>,
): React.ComponentClass<Props & ReactifyProps> {
  class ReactifiedComponent extends React.Component<Props & ReactifyProps> {
    container?: HTMLDivElement;

    constructor(props: Props & ReactifyProps) {
      super(props);
      this.setContainerRef = this.setContainerRef.bind(this);
    }

    componentDidMount() {
      this.execute();
    }

    componentDidUpdate() {
      this.execute();
    }

    componentWillUnmount() {
      this.container = undefined;
    }

    setContainerRef(ref: HTMLDivElement) {
      this.container = ref;
    }

    execute() {
      if (this.container) {
        renderFn(this.container, this.props as Props & ReactifyProps);
      }
    }

    render() {
      const { id, className } = this.props;

      return <div id={id} className={className} ref={this.setContainerRef} />;
    }
  }

  if (renderFn.displayName) {
    (ReactifiedComponent as any).displayName = renderFn.displayName;
  }
  if (renderFn.propTypes) {
    (ReactifiedComponent as any).propTypes = renderFn.propTypes;
  }
  if (renderFn.defaultProps) {
    (ReactifiedComponent as any).defaultProps = renderFn.defaultProps;
  }

  return ReactifiedComponent;
}
