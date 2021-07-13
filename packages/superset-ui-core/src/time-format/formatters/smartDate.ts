import createMultiFormatter from '../factories/createMultiFormatter';

const smartDateFormatter = createMultiFormatter({
  id: 'smart_date',
  label: 'Adaptative Formatting',
  formats: {
    millisecond: '%Y-%m-%d %H:%M:%S.%L',
    second: '%Y-%m-%d %H:%M:%S',
    minute: '%Y-%m-%d %H:%M',
    hour: '%Y-%m-%d %H:%M',
    day: '%Y-%m-%d',
    week: '%Y-%m-%d',
    month: '%B %Y',
    year: '%Y',
  },
});

export default smartDateFormatter;
