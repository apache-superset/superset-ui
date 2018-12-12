import React from 'react';

export type ReactifyProps = {
  id: string;
  className?: string;
};
export type RenderFuncType = ((
  container: HTMLDivElement,
  props: ReactifyProps & { [key: string]: any },
) => void) & {
  displayName?: string;
  defaultProps?: { [key: string]: any };
  propTypes?: { [key: string]: any };
};

export default function reactify(
  renderFn: RenderFuncType,
): React.ComponentType<ReactifyProps & { [key: string]: any }> {
  class ReactifiedComponent extends React.Component<ReactifyProps & { [key: string]: any }> {
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
  if (renderFn.propTypes) {
    ReactifiedComponent.propTypes = renderFn.propTypes;
  }
  if (renderFn.defaultProps) {
    ReactifiedComponent.defaultProps = renderFn.defaultProps;
  }

  return ReactifiedComponent;
}
