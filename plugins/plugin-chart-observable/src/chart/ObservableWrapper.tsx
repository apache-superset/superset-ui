import React, { Component } from 'react';
// @ts-ignore
import { Runtime, Inspector } from '@observablehq/runtime';

interface Props {
  observableUrl: string;
  data: any;
  displayedCells: string[];
  width: number;
  height: number;
}

interface State {
  cellNames: string[];
}
export default class ObservableWrapper extends Component<Props, State> {
  state = { cellNames: [] };
  notebookWrapperRef = React.createRef();
  displayRefs: { [key: string]: HTMLDivElement | null } = {};
  notebook = null;
  dataCell = {
    value: null,
  };

  get notebookURL() {
    const notebookName = this.props.observableUrl.replace(/.*:\/\/observablehq.com\//gim, '');
    return `https://api.observablehq.com/${notebookName}.js?v=3`;
  }

  componentDidMount() {
    import(/* webpackIgnore: true */ this.notebookURL).then(module => {
      this.notebook = module.default;
      const runtime = new Runtime();
      let cellNames: string[] = [];
      if (!this.props.displayedCells.length) {
        runtime.module(this.notebook, Inspector.into(this.notebookWrapperRef.current));
      } else {
        runtime.module(this.notebook, (name: string) => {
          if (name) cellNames.push(name);

          if (this.props.displayedCells.includes(name) && this.displayRefs[name] !== null) {
            console.log(this.refs);
            return new Inspector(this.displayRefs[name]);
          }
          if (name === 'mutable data') {
            return {
              fulfilled: (value: any) => {
                this.dataCell = value;
              },
            };
          }
        });
      }
      this.setState({ cellNames });
    });
  }

  componentDidUpdate(nextProps: Props, nextState: State) {
    if (nextProps.data !== this.props.data) {
      this.dataCell.value = nextProps.data;
    }
  }

  render() {
    const wrapperStyles = {
      overflow: 'auto',
      width: this.props.width,
      height: this.props.height,
    };
    return (
      <div style={wrapperStyles}>
        {this.props.children}
        <div className="notebook-wrapper" ref={this.notebookWrapperRef}>
          {this.props.displayedCells.map(name => (
            <div
              key={name}
              id={`cell-${name}`}
              ref={ref => {
                this.displayRefs[name] = ref;
              }}
            />
          ))}
        </div>
      </div>
    );
  }
}
