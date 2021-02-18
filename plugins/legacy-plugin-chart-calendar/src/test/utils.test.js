import { data } from './sample-data';
import { groupByTimePeriod } from '../utils';
import { extent as d3Extent } from 'd3-array';

const formatData = data =>
  Object.keys(data).map(key => ({
    timestamp: key,
    value: data[key],
  }));

const getSum = data => Object.keys(data).map(key => data[key].reduce((a, b) => a + b.value, 0));

describe('calendarUtils', () => {
  it('groupTimePeriod by min', () => {
    const newData = formatData(data);

    const group = groupByTimePeriod(newData, 'timestamp', 'min');
    const interval = getSum(group);
    const extents = d3Extent(interval);

    expect(Object.keys(group).length).toBe(5832);
    expect(extents).toEqual([1, 27]);
  });

  it('groupTimePeriod by hour', () => {
    const newData = formatData(data);

    const group = groupByTimePeriod(newData, 'timestamp', 'hour');
    const interval = getSum(group);
    const extents = d3Extent(interval);

    expect(Object.keys(group).length).toBe(170);
    expect(extents).toEqual([1, 232]);
  });

  it('groupTimePeriod by day', () => {
    const newData = formatData(data);

    const group = groupByTimePeriod(newData, 'timestamp', 'day');
    const interval = getSum(group);
    const extents = d3Extent(interval);

    expect(Object.keys(group).length).toBe(10);
    expect(extents).toEqual([1, 3042]);
  });

  it('groupTimePeriod by week', () => {
    const newData = formatData(data);

    const group = groupByTimePeriod(newData, 'timestamp', 'week');
    const interval = getSum(group);
    const extents = d3Extent(interval);

    expect(Object.keys(group).length).toBe(4);
    expect(extents).toEqual([1, 12390]);
  });

  it('groupTimePeriod by month', () => {
    const newData = formatData(data);

    const group = groupByTimePeriod(newData, 'timestamp', 'month');
    const interval = getSum(group);
    const extents = d3Extent(interval);

    expect(Object.keys(group).length).toBe(3);
    expect(extents).toEqual([1, 12390]);
  });

  it('groupTimePeriod by year', () => {
    const newData = formatData(data);

    const group = groupByTimePeriod(newData, 'timestamp', 'year');
    const interval = getSum(group);
    const extents = d3Extent(interval);

    expect(Object.keys(group).length).toBe(2);
    expect(extents).toEqual([3, 12390]);
  });
});
