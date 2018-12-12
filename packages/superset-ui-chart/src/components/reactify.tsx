import React from 'react';

type ObjectOfProps = { [key: string]: React.ReactPropTypes };

export type ReactifyProps = {
  id: string;
  className?: string;
} & ObjectOfProps;

// pass along any defined proptypes even though this is not a true React.FunctionComponent
export type RenderFuncType = ((container: HTMLDivElement, props: ReactifyProps) => void) & {
  displayName?: string;
  defaultProps?: ObjectOfProps;
  propTypes?: ObjectOfProps;
};

export default function reactify(renderFn: RenderFuncType): React.ComponentClass<ReactifyProps> {
  class ReactifiedComponent extends React.Component<ReactifyProps> {
    static displayName?: string;
    static propTypes?: object;
    static defaultProps?: object;

    container?: HTMLDivElement;

    constructor(props: ReactifyProps) {
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
