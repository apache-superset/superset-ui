/* eslint-disable sort-keys */

import {
  timeSecond,
  timeMinute,
  timeHour,
  timeDay,
  timeWeek,
  timeSunday,
  timeMonday,
  timeTuesday,
  timeWednesday,
  timeThursday,
  timeFriday,
  timeSaturday,
  timeMonth,
  timeYear,
  utcSecond,
  utcMinute,
  utcHour,
  utcDay,
  utcWeek,
  utcSunday,
  utcMonday,
  utcTuesday,
  utcWednesday,
  utcThursday,
  utcFriday,
  utcSaturday,
  utcMonth,
  utcYear,
} from 'd3-time';

function createUtils(useLocalTime = false) {
  let floorSecond;
  let floorMinute;
  let floorHour;
  let floorDay;
  let floorWeek;
  let floorWeekStartOnSunday;
  let floorWeekStartOnMonday;
  let floorWeekStartOnTuesday;
  let floorWeekStartOnWednesday;
  let floorWeekStartOnThursday;
  let floorWeekStartOnFriday;
  let floorWeekStartOnSaturday;
  let floorMonth;
  let floorYear;
  if (useLocalTime) {
    floorSecond = timeSecond;
    floorMinute = timeMinute;
    floorHour = timeHour;
    floorDay = timeDay;
    floorWeek = timeWeek;
    floorWeekStartOnSunday = timeSunday;
    floorWeekStartOnMonday = timeMonday;
    floorWeekStartOnTuesday = timeTuesday;
    floorWeekStartOnWednesday = timeWednesday;
    floorWeekStartOnThursday = timeThursday;
    floorWeekStartOnFriday = timeFriday;
    floorWeekStartOnSaturday = timeSaturday;
    floorMonth = timeMonth;
    floorYear = timeYear;
  } else {
    floorSecond = utcSecond;
    floorMinute = utcMinute;
    floorHour = utcHour;
    floorDay = utcDay;
    floorWeek = utcWeek;
    floorWeekStartOnSunday = utcSunday;
    floorWeekStartOnMonday = utcMonday;
    floorWeekStartOnTuesday = utcTuesday;
    floorWeekStartOnWednesday = utcWednesday;
    floorWeekStartOnThursday = utcThursday;
    floorWeekStartOnFriday = utcFriday;
    floorWeekStartOnSaturday = utcSaturday;
    floorMonth = utcMonth;
    floorYear = utcYear;
  }

  return {
    floorSecond,
    floorMinute,
    floorHour,
    floorDay,
    floorWeek,
    floorWeekStartOnSunday,
    floorWeekStartOnMonday,
    floorWeekStartOnTuesday,
    floorWeekStartOnWednesday,
    floorWeekStartOnThursday,
    floorWeekStartOnFriday,
    floorWeekStartOnSaturday,
    floorMonth,
    floorYear,
    hasMillisecond: (date: Date) => floorSecond(date) < date,
    hasSecond: (date: Date) => floorMinute(date) < date,
    hasMinute: (date: Date) => floorHour(date) < date,
    hasHour: (date: Date) => floorDay(date) < date,
    isNotFirstDayOfMonth: (date: Date) => floorMonth(date) < date,
    isNotFirstDayOfWeek: (date: Date) => floorWeek(date) < date,
    isNotFirstDayOfWeekStartOnSunday: (date: Date) => floorWeekStartOnSunday(date) < date,
    isNotFirstDayOfWeekStartOnMonday: (date: Date) => floorWeekStartOnMonday(date) < date,
    isNotFirstDayOfWeekStartOnTuesday: (date: Date) => floorWeekStartOnTuesday(date) < date,
    isNotFirstDayOfWeekStartOnWednesday: (date: Date) => floorWeekStartOnWednesday(date) < date,
    isNotFirstDayOfWeekStartOnThursday: (date: Date) => floorWeekStartOnThursday(date) < date,
    isNotFirstDayOfWeekStartOnFriday: (date: Date) => floorWeekStartOnFriday(date) < date,
    isNotFirstDayOfWeekStartOnSaturday: (date: Date) => floorWeekStartOnSaturday(date) < date,
    isNotFirstMonth: (date: Date) => floorYear(date) < date,
  };
}

const utcUtils = createUtils();
const localTimeUtils = createUtils(true);

export { utcUtils, localTimeUtils };
