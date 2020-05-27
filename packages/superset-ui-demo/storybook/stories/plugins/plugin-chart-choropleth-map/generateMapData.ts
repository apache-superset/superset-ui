import loadMap from '../../../../../../plugins/plugin-chart-choropleth-map/src/chart/loadMap';

export default async function generateMapData(map) {
  const { object, metadata } = await loadMap(map);
  return object.features
    .map(f => metadata.keyAccessor(f))
    .map(key => ({
      key,
      count: Math.round(Math.random() * 100),
    }));
}
