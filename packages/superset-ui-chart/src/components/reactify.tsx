import React from 'react';

export type ReactifyProps = {
  id: string;
  className?: string;
};
export type RenderFuncType = (<P extends object>(
  container: HTMLDivElement,
  props: P & ReactifyProps,
) => void) & {
  displayName?: string;
  defaultProps?: { [key: string]: any };
  propTypes?: { [key: string]: any };
};

export default function reactify<P extends object>(
  renderFn: RenderFuncType,
): React.ComponentType<P & ReactifyProps> {
  class ReactifiedComponent extends React.Component<P & ReactifyProps> {
    static displayName?: string;
    static propTypes: object = {};
    static defaultProps: object = {};

    container?: HTMLDivElement;

    constructor(props: P & ReactifyProps) {
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
        renderFn(this.container, this.props);
      }
    }

    render() {
      const { id, className } = this.props;

      return <div id={id} className={className} ref={this.setContainerRef} />;
    }
  }

  if (renderFn.displayName) {
    ReactifiedComponent.displayName = renderFn.displayName;
  }
  /* eslint-disable-next-line react/forbid-foreign-prop-types */
  if (renderFn.propTypes) {
    ReactifiedComponent.propTypes = renderFn.propTypes;
  }
  if (renderFn.defaultProps) {
    ReactifiedComponent.defaultProps = renderFn.defaultProps;
  }

  return ReactifiedComponent;
}
