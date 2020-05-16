import createDate from '../../src/utils/createDate';

describe('createDate({ year, month, date, useLocalTime })', () => {
  it('creates UTC time', () => {
    const time = createDate({ year: 2020, month: 5, date: 15 });
    expect(time.getUTCFullYear()).toEqual(2020);
    expect(time.getUTCMonth()).toEqual(5);
    expect(time.getUTCDate()).toEqual(15);
  });
  it('creates local time when useLocalTime=true', () => {
    const time = createDate({ year: 2020, month: 5, date: 15, useLocalTime: true });
    expect(time.getFullYear()).toEqual(2020);
    expect(time.getMonth()).toEqual(5);
    expect(time.getDate()).toEqual(15);
  });
  it('sets month to January by default', () => {
    const time = createDate({ year: 2020, date: 15 });
    expect(time.getUTCMonth()).toEqual(0);
  });
  it('sets date to 1 by default', () => {
    const time = createDate({ year: 2020, month: 5 });
    expect(time.getUTCDate()).toEqual(1);
  });
});
