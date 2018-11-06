/* eslint react/prop-types: 'off' */
import React from 'react';
import { LegendOrdinal } from '@vx/legend';
import { scaleOrdinal } from '@vx/scale';

export default function RenderPalettes({ title, palettes }) {
  return (
    <div>
      {title && <h2>{title}</h2>}
      <table>
        {palettes.map(({ colors, name, label }) => {
          const scale = scaleOrdinal({
            domain: colors,
            range: colors,
          });

          return (
            <tr key={label || name}>
              <td>
                <strong style={{ margin: '4px 12px 4px 0' }}>{label || name}</strong>
              </td>
              <td>
                <LegendOrdinal
                  direction="row"
                  itemDirection="row"
                  shapeMargin="0"
                  labelMargin="0"
                  itemMargin="0 1px"
                  scale={scale}
                  shape="rect"
                  fill={({ datum }) => scale(datum)}
                  labelFormat={() => ''}
                />
              </td>
            </tr>
          );
        })}
      </table>
    </div>
  );
}
