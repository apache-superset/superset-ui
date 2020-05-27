import React, { useState, useEffect } from 'react';
import generateMapData from './generateMapData';

export default function MapDataProvider({
  map,
  children: Children,
}: {
  map: string;
  children: React.ComponentType<{ data: any }>;
}) {
  const [data, setData] = useState<Record<string, any>[]>([]);
  useEffect(() => {
    generateMapData(map).then(mapData => {
      setData(mapData);
    });
  }, [map]);

  return <Children data={data} />;
}
