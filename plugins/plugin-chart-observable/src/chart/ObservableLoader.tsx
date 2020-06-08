import React, { Component } from 'react';
// eslint-disable-next-line import/no-unresolved
import { connect } from 'react-redux';
// @ts-ignore
import { Runtime, Inspector } from '@observablehq/runtime';

interface Props {
  observableUrl: string;
  data: any;
  displayedCells: string[];
  dataInjectionCell: string;
  broadcastCells: Function;
  selectControlOptions: string[];
  width: number;
  height: number;
  children: React.ReactNode;
}

class ObservableLoader extends Component<Props> {
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

      const runtime = new Runtime();
      let notebookModule = null;

      if (this.props.displayedCells.length === 0) {
        // render the entrire notebook if no displayedCells selected
        notebookModule = runtime.module(
          this.notebook,
          Inspector.into(this.notebookWrapperRef.current),
        );
      } else {
        notebookModule = runtime.module(this.notebook, (name: string) => {
          // render selected cells
          if (this.props.displayedCells.includes(name) && this.displayRefs[name] !== null) {
            return new Inspector(this.displayRefs[name]);
          }
          return null;
        });
      }

      // gather cell names
      // eslint-disable-next-line no-underscore-dangle
      const cellNames = Array.from<any[]>(notebookModule._scope).map((item: any[]) => item[0]);
      if (!this.props.selectControlOptions) {
        this.props.broadcastCells(cellNames);
      }

      // inject the data
      if (this.props.dataInjectionCell.length > 0) {
        notebookModule.redefine(this.props.dataInjectionCell, [], this.props.data);
      }
      // define height
      notebookModule.redefine('width', [], this.props.width);
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
        <div ref={this.notebookWrapperRef} className="notebook-wrapper">
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

function overwriteSelectControlOptions(selectControlOptions: string[]) {
  return { type: 'OVERWRITE_SELECT_CONTROL_OPTIONS', selectControlOptions };
}

function mapSateToProps(state: any) {
  return {
    selectControlOptions: state.explore.selectControlOptions,
  };
}

function mapDispatchToProps(dispatch: Function) {
  return {
    broadcastCells: (cellList: string[]) => dispatch(overwriteSelectControlOptions(cellList)),
  };
}
export default connect(mapSateToProps, mapDispatchToProps)(ObservableLoader);
