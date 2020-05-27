import React, { Component } from 'react';
// @ts-ignore
import { Runtime, Inspector } from '@observablehq/runtime';

interface Props {
  observableUrl: string;
  data: any;
  displayedCells: string[];
}

interface State {
  cellNames: string[];
}
export default class ObservableWrapper extends Component<Props, State> {
  state = { cellNames: [] };
  notebookWrapperRef = React.createRef();
  refs = this.props.displayedCells.reduce((acc, cellName) => {
    acc[cellName] = React.createRef();
    return acc;
  }, {});
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
      const cellNames: string[] = [];
      runtime.module(this.notebook, (name: string) => {
        if (name) cellNames.push(name);
        if (this.props.displayedCells.includes(name)) {
          return new Inspector(this.refs[name].current);
        }
        if (name === 'mutable data') {
          return {
            fulfilled: (value: any) => {
              this.dataCell = value;
            },
          };
        }
      });
      this.setState({ cellNames });
    });
  }

  componentDidUpdate(nextProps: Props, nextState: State) {
    if (nextProps.data !== this.props.data) {
      this.dataCell.value = nextProps.data;
    }
  }

  render() {
    console.log(this.props.displayedCells);
    return (
      <div className="notebook-wrapper">
        {this.props.displayedCells.map(name => (
          <div id={`cell-${name}`} ref={this.refs[name]} />
        ))}
      </div>
    );
  }
}
