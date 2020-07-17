import processExtraFilters from '../src/processExtraFilters';

describe('processExtraFilters', () => {
  it('should handle double underscored date options', () => {
    expect(
      processExtraFilters({
        extra_filters: [
          {
            col: '__time_range',
            op: '=',
            val: '2009-07-17T00:00:00 : 2020-07-17T00:00:00',
          },
        ],
      }),
    ).toEqual({
      time_range: '2009-07-17T00:00:00 : 2020-07-17T00:00:00',
    });
  });

  it('should create regular filters from non-reserved columns', () => {
    expect(
      processExtraFilters({
        extra_filters: [
          {
            col: 'gender',
            op: 'IN',
            val: ['girl'],
          },
        ],
      }),
    ).toEqual({
      filters: [
        {
          col: 'gender',
          op: 'IN',
          val: ['girl'],
        },
      ],
    });
  });
});
