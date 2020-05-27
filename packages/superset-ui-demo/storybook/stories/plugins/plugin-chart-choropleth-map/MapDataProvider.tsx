import React, { useState, useEffect } from 'react';
import generateMapData from './generateMapData';

export default function MapDataProvider({
  map,
  children: Children,
}: {
  map: string;
  children: React.ComponentType<{ data: Record<string, unknown>[] }>;
}) {
  const [data, setData] = useState<Record<string, unknown>[]>([]);
  useEffect(() => {
    generateMapData(map).then(mapData => {
      setData(mapData);
    });
  }, [map]);

  return <Children data={data} />;
}
