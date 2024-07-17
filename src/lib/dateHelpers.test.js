import { describe, expect, it } from "@jest/globals";
import {
  format,
  setHours,
  setMinutes,
  startOfToday,
  startOfTomorrow,
  startOfYesterday,
} from "date-fns";

import { noDataMessage } from "@/components/tables/columns/TransferTableColumns";
import { NO_TIME } from "@/lib/constants/timeConstants";

import {
  DateAtHourFormat,
  DayWithOrdinalMonthTimeFormat,
} from "./constants/timeConstants";
import {
  adjustDateToTime,
  adjustTimezoneOffSetToUTC,
  constrain,
  constrainTime,
  convertDateTimeToLondon,
  extractStartTime,
  formatWithDefaultTimeZone,
  getCurrentEpochTime,
  getFormattedDate,
  getFormattedDateTime,
  getFormattedDatetimeString,
  getFormattedLongDate,
  getFormattedLongDateWithDay,
  getFormattedTableDateString,
  getFormattedTableTime,
  getIntervalAsString,
  getLongDateString,
  getNextDate,
  getPrevDate,
  getWeekNumberAndYear,
  isDateBetween,
  isSameDate,
  isTodayOrTomorrow,
  isValidDate,
  minutesToDuration,
  parseFormattedTableDateTime,
} from "./dateHelpers";

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);
const indexer = (table) => table.map((row, idx) => [...row, idx]);

const datesToTest = indexer([
  ["first day of the year", new Date(2020, 0, 1)],
  ["10th of July", new Date(2022, 6, 10)],
  ["29th Feb, leap year", new Date(2024, 1, 29)],
  ["the last day of the year", new Date(2023, 11, 31)],
]);

describe("The getFormattedDateTime function", () => {
  const expectedOutputs = [
    "2020-01-01 00:00:00",
    "2022-07-10 00:00:00",
    "2024-02-29 00:00:00",
    "2023-12-31 00:00:00",
  ];

  it.each(datesToTest)("Formats %s", (condition, date, index) => {
    const expected = expectedOutputs[index];
    const result = getFormattedDateTime(date);

    expect(result).toEqual(expected);
  });
});

describe("The getFormattedDate function", () => {
  const expectedOutputs = [
    "2020-01-01",
    "2022-07-10",
    "2024-02-29",
    "2023-12-31",
  ];
  it.each(datesToTest)("Formats %s", (condition, date, index) => {
    const expected = expectedOutputs[index];
    const result = getFormattedDate(date);

    expect(result).toEqual(expected);
  });
});

describe("getFormattedLongDate", () => {
  const expectedOutputs = [
    "January 1, 2020",
    "July 10, 2022",
    "February 29, 2024",
    "December 31, 2023",
  ];

  it.each(datesToTest)("Formats %s", (condition, date, index) => {
    const expected = expectedOutputs[index];
    const result = getFormattedLongDate(date);

    expect(result).toEqual(expected);
  });
});

describe("getFormattedLongDateWithDay function", () => {
  const expectedOutputs = [
    "Wednesday, January 1, 2020",
    "Sunday, July 10, 2022",
    "Thursday, February 29, 2024",
    "Sunday, December 31, 2023",
  ];
  it.each(datesToTest)("Formats %s", (condition, date, index) => {
    const expected = expectedOutputs[index];
    const result = getFormattedLongDateWithDay(date);

    expect(result).toEqual(expected);
  });
});

describe("getLongDateString() function", () => {
  const expectedOutputs = [
    "Wednesday 1st January 2020",
    "Sunday 10th July 2022",
    "Thursday 29th February 2024",
    "Sunday 31st December 2023",
  ];
  it.each(datesToTest)("Formats %s", (condition, date, index) => {
    const expected = expectedOutputs[index];
    const result = getLongDateString(date);

    expect(result).toEqual(expected);
  });
});

describe("getFormattedTableTime", () => {
  const testCases = [
    [null, "should return correct message when dataDateTime is null", NO_TIME],
    [
      undefined,
      "should return correct message when dataDateTime is undefined",
      NO_TIME,
    ],
    [
      "2023-10-17T07:30:00",
      "should return formatted time for the daily page",
      "07:30",
    ],
    [
      "",
      "should return correct message when dataDateTime is an empty string",
      NO_TIME,
    ],
  ];

  testCases.forEach(([dataDateTime, description, expected]) => {
    it(description, () => {
      const result = getFormattedTableTime(dataDateTime, NO_TIME);
      expect(result).toEqual(expected);
    });
  });
});

describe("The getCurrentEpochTime function", () => {
  it("returns an integer number", () => {
    expect(Number.isInteger(getCurrentEpochTime())).toBeTruthy();
  });

  it("returns a lower value then a future date", () => {
    const today = new Date();
    const inAFewDaysEpochSeconds = Math.floor(
      today.setDate(today.getDate() + 3) / 1000,
    );
    expect(getCurrentEpochTime() < inAFewDaysEpochSeconds).toBeTruthy();
  });

  it("returns a higher value then a past date", () => {
    const today = new Date();
    const aFewDaysAgoEpochSeconds = Math.floor(
      today.setDate(today.getDate() - 3) / 1000,
    );
    expect(getCurrentEpochTime() > aFewDaysAgoEpochSeconds).toBeTruthy();
  });
});

describe("isDateBetween", () => {
  const testCases = [
    {
      targetDate: new Date("2023-01-15"),
      startDate: new Date("2023-01-01"),
      endDate: new Date("2023-02-01"),
      expected: true,
      condition: "target date is between start and end dates",
    },
    {
      targetDate: new Date("2023-01-01"),
      startDate: new Date("2023-01-15"),
      endDate: new Date("2023-02-01"),
      expected: false,
      condition: "target date is before start date",
    },
    {
      targetDate: new Date("2023-02-15"),
      startDate: new Date("2023-01-01"),
      endDate: new Date("2023-02-01"),
      expected: false,
      condition: "target date is after end date",
    },
    {
      targetDate: new Date("2023-01-15"),
      startDate: undefined,
      endDate: undefined,
      expected: true,
      condition: "no start and end dates are provided",
    },
    {
      targetDate: undefined,
      startDate: new Date("2023-01-01"),
      endDate: new Date("2023-02-01"),
      expected: false,
      condition: "target date is not provided",
    },
  ];

  it.each(testCases)(
    "returns $expected when $condition",
    ({ targetDate, startDate, endDate, expected }) => {
      const result = isDateBetween(targetDate, startDate, endDate);
      expect(result).toBe(expected);
    },
  );
});

describe("isValidDate", () => {
  const testCases = [
    {
      dateString: "2023-01-15",
      expected: true,
      condition: "a valid date string",
    },
    {
      dateString: "invalid-date",
      expected: false,
      condition: "an invalid date string",
    },
    {
      dateString: null,
      expected: false,
      condition: "a null input",
    },
    {
      dateString: undefined,
      expected: false,
      condition: "an undefined input",
    },
    {
      dateString: 23,
      expected: false,
      condition: "a number input",
    },
  ];

  it.each(testCases)(
    "returns $expected when given $condition",
    ({ dateString, expected }) => {
      const result = isValidDate(dateString);
      expect(result).toBe(expected);
    },
  );
});

describe("getWeekNumberAndYear", () => {
  it.each([
    [new Date("2023-01-01"), 52, 2022],
    [new Date("2023-01-02"), 1, 2023],
    [new Date("2024-02-29"), 9, 2024],
  ])(
    "given date %p, it should return week %i and year %i",
    (date, expectedWeek, expectedYear) => {
      const result = getWeekNumberAndYear(date);
      expect(result.weekNumber).toBe(expectedWeek);
      expect(result.year).toBe(expectedYear);
    },
  );
});

describe("getPrevDate() helper", () => {
  const expectedOutputs = [
    new Date(2019, 11, 31),
    new Date(2022, 6, 9),
    new Date(2024, 1, 28),
    new Date(2023, 11, 30),
  ];
  it.each(datesToTest)(
    "correctly gets previous day when date is %s",
    (condition, date, index) => {
      const expected = expectedOutputs[index];
      const result = getPrevDate(date);

      expect(result).toEqual(expected);
    },
  );
});

describe("getNextDate() helper", () => {
  const expectedOutputs = [
    new Date(2020, 0, 2),
    new Date(2022, 6, 11),
    new Date(2024, 2, 1),
    new Date(2024, 0, 1),
  ];

  it.each(datesToTest)(
    "correctly gets next day when date is %s",
    (condition, date, index) => {
      const expected = expectedOutputs[index];
      const result = getNextDate(date);

      expect(result).toEqual(expected);
    },
  );
});

describe("getIntervalAsString function", () => {
  const testCases = [
    {
      dateFrom: new Date("2024-02-18T12:00:00"),
      duration: { hours: 2, minutes: 30 },
      dateFormat: "yyyy-MM-dd HH:mm:ss",
      expected: "2024-02-18 12:00:00 - 2024-02-18 14:30:00",
      description: "duration is positive",
    },
    {
      dateFrom: new Date("2024-02-18T18:45:00"),
      duration: { hours: 1, minutes: 15 },
      dateFormat: "MMM d, yyyy h:mm a",
      expected: "Feb 18, 2024 6:45 PM - Feb 18, 2024 8:00 PM",
      description: "there are different date formats",
    },
    {
      dateFrom: new Date("2024-02-18T08:00:00"),
      duration: { hours: -3, minutes: 45 },
      dateFormat: "yyyy/MM/dd HH:mm",
      expected: "2024/02/18 08:00 - 2024/02/18 05:45",
      description: "duration is negative",
    },
  ];

  it.each(testCases)(
    "it returns $expected when $description",
    ({ dateFrom, duration, dateFormat, expected }) => {
      const result = getIntervalAsString(dateFrom, duration, dateFormat);
      expect(result).toBe(expected);
    },
  );
});

describe("minutesToDuration", () => {
  it("should convert minutes to duration with hours, minutes, and seconds", () => {
    const result = minutesToDuration(150.5); // 2 hours 30 minutes 30 seconds

    expect(result).toBe("2h 30m");
  });

  it("should convert minutes to duration with only minutes", () => {
    const result = minutesToDuration(45); // 45 minutes

    expect(result).toBe("45m");
  });

  it("should convert minutes to duration with only seconds and no hours", () => {
    const result = minutesToDuration(0.5); // 30 seconds

    expect(result).toBe("30s");
  });

  it("should convert 0 minutes to an empty string", () => {
    const result = minutesToDuration(0);

    expect(result).toBe("");
  });

  it("should round the number of seconds", () => {
    const result = minutesToDuration(1.3);

    expect(result).toBe("1m 18s");
  });
});

describe("isSameDate function", () => {
  const testCases = [
    {
      date1: new Date("2024-02-18T12:00:00"),
      date2: new Date("2024-02-18T12:00:00"),
      expected: true,
      description: "dates are the same, with the same time",
    },
    {
      date1: new Date("2024-02-18T12:00:00"),
      date2: new Date("2024-02-18T12:01:00"),
      expected: true,
      description: "dates are the same, with different times",
    },
    {
      date1: new Date("2024-02-18T12:00:00"),
      date2: new Date("2024-02-19T12:00:00"),
      expected: false,
      description: "dates are different",
    },
  ];

  it.each(testCases)(
    "it returns $expected when $description",
    ({ date1, date2, expected }) => {
      const result = isSameDate(date1, date2);
      expect(result).toBe(expected);
    },
  );
});

describe("isTodayOrTomorrow function", () => {
  const testCases = [
    {
      datetime: new Date("2024-02-18T12:00:00"),
      expected: { isToday: false, isTomorrow: false },
      description: "datetime is neither today nor tomorrow",
    },
    {
      datetime: today,
      expected: { isToday: true, isTomorrow: false },
      description: "datetime is today",
    },
    {
      datetime: tomorrow,
      expected: { isToday: false, isTomorrow: true },
      description: "datetime is tomorrow",
    },
  ];

  it.each(testCases)(
    "returns $expected when $description",
    ({ datetime, expected }) => {
      const result = isTodayOrTomorrow(datetime);
      expect(result).toEqual(expected);
    },
  );
});

describe("getFormattedTableDateString function", () => {
  const testCases = [
    {
      datetime: new Date("2024-02-18T12:00:00"),
      includeTime: true,
      expected: "18th Feb 2024, 12:00",
      description: "datetime is neither today nor tomorrow, include time",
    },
    {
      datetime: today,
      includeTime: true,
      expected: `Today, ${format(today, "HH:mm")}`,
      description: "datetime is today, include time",
    },
    {
      datetime: tomorrow,
      includeTime: true,
      expected: `Tomorrow, ${format(tomorrow, "HH:mm")}`,
      description: "datetime is tomorrow, include time",
    },
    {
      datetime: today,
      includeTime: false,
      expected: "Today, ",
      description: "datetime is today, exclude time",
    },
    {
      datetime: tomorrow,
      includeTime: false,
      expected: "Tomorrow, ",
      description: "datetime is tomorrow, exclude time",
    },
  ];

  it.each(testCases)(
    "returns $expected when $description",
    ({ datetime, includeTime, expected }) => {
      const result = getFormattedTableDateString(datetime, includeTime);
      expect(result).toEqual(expected);
    },
  );
});

describe("The getFormattedDatetimeString() helper", () => {
  it.each([
    { input: "", dateFormat: "", expected: noDataMessage },
    {
      input: "2024-01-01T12:00:00Z",
      dateFormat: DayWithOrdinalMonthTimeFormat,
      expected: "1st Jan, 12:00",
    },
    {
      input: "2024-01-01T12:00:00Z",
      dateFormat: DateAtHourFormat,
      expected: "01/01/2024 at 12:00",
    },
  ])("returns expected results", (data) => {
    const { input, dateFormat, expected } = data;
    expect(getFormattedDatetimeString(input, dateFormat, noDataMessage)).toBe(
      expected,
    );
  });
});

describe("constrain function", () => {
  it("returns the same value when it is between minDate and maxDate", () => {
    const value = new Date("2024-04-10T12:00:00");
    const minDate = new Date("2024-04-10T00:00:00");
    const maxDate = new Date("2024-04-10T23:59:59");

    expect(constrain(value, minDate, maxDate)).toEqual(value);
  });

  it("returns minDate when value is before minDate", () => {
    const value = new Date("2024-04-10T12:00:00");
    const minDate = new Date("2024-04-10T13:00:00");

    expect(constrain(value, minDate)).toEqual(minDate);
  });

  it("returns maxDate when value is after maxDate", () => {
    const value = new Date("2024-04-10T12:00:00");
    const maxDate = new Date("2024-04-10T11:00:00");

    expect(constrain(value, undefined, maxDate)).toEqual(maxDate);
  });

  it("returns the same value when no minDate and maxDate provided", () => {
    const value = new Date("2024-04-10T12:00:00");

    expect(constrain(value)).toEqual(value);
  });
});

describe("constrainTime function", () => {
  it("returns the same value when it is between minTime and maxTime", () => {
    const value = new Date("2024-04-10T12:30:00");
    const minTime = new Date("2024-04-10T12:00:00");
    const maxTime = new Date("2024-04-10T13:00:00");

    expect(constrainTime(value, minTime, maxTime)).toEqual(value);
  });

  it("returns minTime when value is before minTime", () => {
    const value = new Date("2024-04-10T12:30:00");
    const minTime = new Date("2024-04-10T13:00:00");

    expect(constrainTime(value, minTime)).toEqual(minTime);
  });

  it("returns maxTime when value is after maxTime", () => {
    const value = new Date("2024-04-10T12:30:00");
    const maxTime = new Date("2024-04-10T12:00:00");

    expect(constrainTime(value, undefined, maxTime)).toEqual(maxTime);
  });

  it("returns the same value when no minTime and maxTime provided", () => {
    const value = new Date("2024-04-10T12:30:00");

    expect(constrainTime(value)).toEqual(value);
  });
});

describe("adjustDateToTime function", () => {
  it("adjusts the date to the time provided", () => {
    const date = new Date("2024-04-10T12:00:00");
    const time = new Date("2024-04-10T15:30:00");
    const adjustedDate = new Date("2024-04-10T15:30:00");

    expect(adjustDateToTime(date, time)).toEqual(adjustedDate);
  });
});

describe("convertDateTimeToLondon function", () => {
  const testCases = [
    { date: null, expected: NO_TIME, condition: "null" },
    { date: undefined, expected: NO_TIME, condition: "undefined" },
    {
      date: new Date("2023-10-17T07:30:00Z"),
      expected: "2023-10-17 08:30:00 GMT+1",
      condition: "a valid date using UTC time during BST",
    },
    {
      date: new Date("2023-01-23T22:30:00Z"),
      expected: "2023-01-23 22:30:00 GMT",
      condition: "a valid date using UTC time not during BST",
    },
    {
      date: new Date("2024-05-09T00:00:00Z"),
      expected: "2024-05-09 01:00:00 GMT+1",
      condition: "a valid date - handles midnight UTC during BST",
    },
    {
      date: new Date("2024-05-09"),
      expected: "2024-05-09 01:00:00 GMT+1",
      condition: "a valid date with no specified time during BST",
    },
    {
      date: new Date("2024-05-09T23:00:00Z"),
      expected: "2024-05-10 00:00:00 GMT+1",
      condition: "a valid date - handles 23:00 UTC and midnight BST",
    },
    {
      date: "2023-10-17T07:30:00Z",
      expected: "2023-10-17 08:30:00 GMT+1",
      condition: "a valid date string using UTC time during BST",
    },
    {
      date: "2024-11-14",
      expected: "2024-11-14 00:00:00 GMT",
      condition: "a valid date string with no specified time not during BST",
    },
    {
      date: "2024-02-29T00:00:00Z",
      expected: "2024-02-29 00:00:00 GMT",
      condition: "a valid date string - handles leap year",
    },
    {
      date: "invalid-date-string",
      expected: NO_TIME,
      condition: "an invalid date string",
    },
  ];

  it.each(testCases)(
    "should return $expected when given $condition",
    ({ expected, date }) => {
      const result = convertDateTimeToLondon(date);
      expect(result).toEqual(expected);
    },
  );
});

describe("adjustTimezoneOffSetToUTC", () => {
  it("should return the date adjusted to UTC for the default timezone (Europe/London)", () => {
    const date = new Date("2023-06-20T12:00:00Z");
    const result = adjustTimezoneOffSetToUTC(date);
    expect(result.toISOString()).toEqual("2023-06-20T12:00:00.000Z");
  });

  it("should return the date adjusted to UTC for a specified timezone", () => {
    const date = new Date("2023-06-20T12:00:00Z");
    const timezone = "America/New_York";
    const result = adjustTimezoneOffSetToUTC(date, timezone);
    expect(result.toISOString()).toEqual("2023-06-20T17:00:00.000Z");
  });
});

describe("formatWithDefaultTimeZone", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should format a valid date string using the default timezone", () => {
    const date = "2023-06-24T12:00:00Z";
    const format = "yyyy-MM-dd HH:mm:ssXXX";

    const result = formatWithDefaultTimeZone(date, format);

    expect(result).toBe("2023-06-24 13:00:00+01:00");
  });

  it("should return NO_TIME for an invalid date string, null date and undefined", () => {
    // Invalid Date
    let date = "invalid-date";
    const format = "yyyy-MM-dd HH:mm:ssXXX";
    let result = formatWithDefaultTimeZone(date, format);
    expect(result).toBe(NO_TIME);

    // Null Date
    date = null;
    result = formatWithDefaultTimeZone(date, format);
    expect(result).toBe(NO_TIME);

    // Undefined Date
    date = null;
    result = formatWithDefaultTimeZone(date, format);
    expect(result).toBe(NO_TIME);
  });

  it("should format a valid Date object using the default timezone", () => {
    const date = new Date("2023-06-24T12:00:00Z");
    const format = "yyyy-MM-dd HH:mm:ssXXX";

    const result = formatWithDefaultTimeZone(date, format);

    expect(result).toBe("2023-06-24 13:00:00+01:00");
  });

  it("should format a valid date string using a custom timezone", () => {
    const date = "2023-06-24T12:00:00Z";
    const format = "yyyy-MM-dd HH:mm:ssXXX";
    const timezone = "America/New_York";

    const result = formatWithDefaultTimeZone(date, format, timezone);

    expect(result).toBe("2023-06-24 08:00:00-04:00");
  });
});

describe("parseFormattedTableDateTime function", () => {
  const today = startOfToday();
  const tomorrow = startOfTomorrow();
  const yesterday = startOfYesterday();
  const testCases = [
    { string: NO_TIME, expected: null, hasDate: false },
    {
      string: "09:10 - 09:20",
      expected: setMinutes(setHours(new Date(today), 9), 10),
      hasDate: false,
    },
    {
      string: "09:10",
      expected: setMinutes(setHours(new Date(today), 9), 10),
      hasDate: false,
    },
    {
      string: "est. 09:10",
      expected: setMinutes(setHours(new Date(today), 9), 10),
      hasDate: false,
    },
    {
      string: "est. Today, 09:10",
      expected: setMinutes(setHours(new Date(today), 9), 10),
      hasDate: true,
    },
    {
      string: "est. today, 09:10",
      expected: setMinutes(setHours(new Date(today), 9), 10),
      hasDate: true,
    },
    {
      string: "est. Today, 09:10 - 09:20",
      expected: setMinutes(setHours(new Date(today), 9), 10),
      hasDate: true,
    },
    {
      string: "est. Tomorrow, 09:10 - 09:20",
      expected: setMinutes(setHours(new Date(tomorrow), 9), 10),
      hasDate: true,
    },
    {
      string: "Tomorrow, 09:10 - 09:20",
      expected: setMinutes(setHours(new Date(tomorrow), 9), 10),
      hasDate: true,
    },
    {
      string: "tomorrow, 09:10 - 09:20",
      expected: setMinutes(setHours(new Date(tomorrow), 9), 10),
      hasDate: true,
    },
    {
      string: "Yesterday, 12:10 - 12:20",
      expected: setMinutes(setHours(new Date(yesterday), 12), 10),
      hasDate: true,
    },
    {
      string: "yesterday, 12:10 - 12:20",
      expected: setMinutes(setHours(new Date(yesterday), 12), 10),
      hasDate: true,
    },
    {
      string: "23rd Jan 2024, 09:10 - 09:20",
      expected: new Date(2024, 0, 23, 9, 10, 0),
      hasDate: true,
    },
    {
      string: "29th Feb 2024, 23:40 - 23:50",
      expected: new Date(2024, 1, 29, 23, 40, 0),
      hasDate: true,
    },
  ];

  it.each(testCases)(
    "should return $expected when given $string and hasDate = $hasDate",
    ({ string, expected, hasDate }) => {
      const result = parseFormattedTableDateTime(string, hasDate);
      expect(result).toEqual(expected);
    },
  );
});

describe("extractStartTime function", () => {
  const testCases = [
    { string: NO_TIME, expected: [0, 0] },
    { string: "I am not a time", expected: [0, 0] },
    {
      string: "09:10 - 09:20",
      expected: [9, 10],
    },
    {
      string: "09:10",
      expected: [9, 10],
    },
    {
      string: "est. 09:10",
      expected: [9, 10],
    },
    {
      string: "est. Today, 09:10",
      expected: [9, 10],
    },
    {
      string: "12:50 - 13:00",
      expected: [12, 50],
    },
    {
      string: "29th Feb 2024, 23:40 - 23:50",
      expected: [23, 40],
    },
    {
      string: "29th Feb 2024, 00:00 - 00:10",
      expected: [0, 0],
    },
    {
      string: "29th Jul 2024, 14:14 - 14:24",
      expected: [14, 14],
    },
  ];

  it.each(testCases)(
    "should return $expected when given $string",
    ({ string, expected }) => {
      const result = extractStartTime(string);
      expect(result).toEqual(expected);
    },
  );
});
