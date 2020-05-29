/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable unicorn/explicit-length-check */
/* eslint-disable no-negated-condition */
import React, { Component } from 'react';
// @ts-ignore
import { Runtime, Inspector, Library } from '@observablehq/runtime';

interface Props {
  observableUrl: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      const fullModule = refRuntime.module(this.notebook);
      // eslint-disable-next-line no-underscore-dangle
      const cellNames = Array.from(fullModule._scope).map(item => item[0]);
      // ok, now broadcast the names...

      const cellNameUpdate = new Event('cellNameUpdate', cellNames);
      // @ts-ignore
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
              ref={ref => {
                this.displayRefs[name] = ref;
              }}
              key={name}
              id={`cell-${name}`}
            />
          ))}
        </div>
        {this.props.children}
      </div>
    );
  }
}
