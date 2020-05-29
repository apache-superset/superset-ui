import React, { Component } from 'react';
// @ts-ignore
import { Runtime, Inspector, Library } from '@observablehq/runtime';

interface Props {
  observableUrl: string;
  data: any;
  displayedCells: string[];
  dataInjectionCell: string;
  width: number;
  height: number;
}

export default class ObservableLoader extends Component<Props> {
  notebookWrapperRef = React.createRef<HTMLDivElement>();
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

      // just get the damned names.
      const refRuntime = new Runtime();
      let fullModule = refRuntime.module(this.notebook);
      let cellNames = Array.from(fullModule._scope).map(item => item[0]);
      // ok, now broadcast the names...

      const cellNameUpdate = new Event('cellNameUpdate', cellNames);
      window.cellNames = cellNames;
      window.dispatchEvent(cellNameUpdate);

      const runtime = new Runtime();
      let module_ = null;

      if (!this.props.displayedCells.length) {
        module_ = runtime.module(this.notebook, Inspector.into(this.notebookWrapperRef.current));
      } else {
        module_ = runtime.module(this.notebook, (name: string) => {
          if (this.props.displayedCells.includes(name) && this.displayRefs[name] !== null) {
            return new Inspector(this.displayRefs[name]);
          }
        });
      }
      module_.redefine(this.props.dataInjectionCell, [], this.props.data);
      module_.redefine('width', [], this.props.width);
      module_.redefine('height', [], this.props.height);
    });
  }

  render() {
    const wrapperStyles = {
      overflow: 'auto',
      width: this.props.width,
      height: this.props.height,
    };
    return (
      <div style={wrapperStyles}>
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
        {this.props.children}
      </div>
    );
  }
}
