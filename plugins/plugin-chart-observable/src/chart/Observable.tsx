import React from 'react';
import { PlainObject } from 'encodable';
import { SupersetThemeProps } from '@superset-ui/style';

/**
 * These props should be stored when saving the chart.
 */
export interface ObservableVisualProps {
  observableUrl?: string;
  displayedCells: string[];
}

export interface ObservableProps extends ObservableVisualProps {
  data: PlainObject[];
  height: number;
  width: number;
}

class Observable extends React.PureComponent<ObservableProps & SupersetThemeProps> {
  render() {
    const { width, height, data, observableUrl, displayedCells, showDebug } = this.props;

    return (
      <div>
        {showDebug && (
          <div>
            <h2>Observable URL</h2>
            <div>{observableUrl || 'none set'}</div>
            <h2>Width / Height</h2>
            <div>
              {width} / {height}
            </div>
            <h2>Displayed Cells</h2>
            <pre>{JSON.stringify(displayedCells, undefined, 2)}</pre>
            <h2>Data</h2>
            <pre>{JSON.stringify(data, undefined, 2)}</pre>
          </div>
        )}
      </div>
    );
  }
}

export default Observable;
