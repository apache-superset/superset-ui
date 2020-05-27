import loadMap from '../../../../../../plugins/plugin-chart-choropleth-map/src/chart/loadMap';

const FRUITS = ['apple', 'banana', 'grape'];

/**
 * Generate mock data for the given map
 * Output is a promise of an array
 * { key, favoriteFruit, numStudents }[]
 * @param map map name
 */
export default async function generateMapData(map: string) {
  const { object, metadata } = await loadMap(map);
  return object.features
    .map(f => metadata.keyAccessor(f))
    .map(key => ({
      key,
      favoriteFruit: FRUITS[Math.round(Math.random() * 2)],
      numStudents: Math.round(Math.random() * 100),
    }));
}
