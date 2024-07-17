import { describe, expect, it } from "@jest/globals";
import { add, format, setHours, setMinutes } from "date-fns";

import { noDataMessage } from "../components/tables/columns/TransferTableColumns";

import { ApianTransferStatusCodes } from "./constants/apianTransferStatuses";
import {
  EST_TXT,
  SIMILAR_NUM_ORDERS_INCLUDING_MSG_TXT,
  SIMILAR_NUM_ORDERS_MSG_TXT,
  SIMILAR_ORDER_ALERT_TITLE,
  SIMILAR_ORDER_AT_MSG_TXT,
  SIMILAR_ORDER_MSG_TXT,
  SIMILAR_ORDER_QUESTION_TXT,
  SIMILAR_ORDERS_ALERT_TITLE,
} from "./constants/pageTextConstants";
import {
  dayOrdinalShortMonthFormat,
  ISO8601DateTimeFormat,
  NO_TIME,
  TwentyFourHourFormat,
} from "./constants/timeConstants";
import {
  mockFriHours,
  mockSatHours,
  mockSenderSchedule,
  mockSenderScheduleDiffTimes,
  mockSenderScheduleWeekend,
  mockThursHours,
  mockWedHours,
  recurringOrderDates,
  recurringOrderDatesPlusOneMonth,
  testLocationOptionsWithSchedule,
} from "./testHelpers/mockData";
import {
  formatWithDefaultTimeZone,
  nowPlusOneHourString,
  todayDateString,
  yesterdayDateString,
} from "./dateHelpers";
import {
  checkDayAgainstSchedule,
  checkMappingsForRecipientLocation,
  checkOrdersAgainstSchedule,
  findMappingsBySenderCode,
  findSchedule,
  findScheduleTime,
  getEstimatedDurationUntilArrivalTimeAsString,
  getFormattedOrderTableDate,
  getNextOrderEstimatedUntilArrivalTimeFormatted,
  getOpeningHours,
  getOrderArrivalTimeAsString,
  getOrderDeliveryDayString,
  getOrderScheduledArrivalTimeString,
  getOrderStatusEventDatetimeString,
  getRecurringOrderDates,
  getSimilarOrderDayString,
  getSimilarWarningsMessages,
  getTimeFromSchedule,
  incrementWeekdays,
  isCancellable,
  isOrderFlightActive,
  isPreviousOrder,
  isUpcomingOrder,
  reassignDayFromSunToMonWeekStart,
} from "./orderHelpers";

describe("The isUpcomingOrder() helper", () => {
  it.each([
    {
      orderListItemMock: {
        sender_location: {
          scheduled_pickup_datetime: todayDateString,
        },
        status: ApianTransferStatusCodes.PENDING,
      },
      expected: true,
    },
    {
      orderListItemMock: {
        sender_location: {
          scheduled_pickup_datetime: yesterdayDateString,
        },
        status: ApianTransferStatusCodes.PENDING,
      },
      expected: false,
    },
  ])("returns expected result", (data) => {
    const { orderListItemMock, expected } = data;
    expect(isUpcomingOrder(orderListItemMock)).toBe(expected);
  });
});

describe("The isPreviousOrder() helper", () => {
  it.each([
    {
      orderListItemMock: {
        sender_location: {
          scheduled_pickup_datetime: todayDateString,
        },
        status: ApianTransferStatusCodes.TRANSFER_COMPLETED,
      },
      expected: true,
    },
    {
      orderListItemMock: {
        sender_location: {
          scheduled_pickup_datetime: yesterdayDateString,
        },
        status: ApianTransferStatusCodes.PENDING,
      },
      expected: true,
    },
  ])("returns expected result", (data) => {
    const { orderListItemMock, expected } = data;
    expect(isPreviousOrder(orderListItemMock)).toBe(expected);
  });
});

describe("The getFormattedOrderTableDate() helper", () => {
  let todayDate = new Date();
  let yesterdayDate = add(new Date(), { days: -1 });
  let tomorrowDate = add(new Date(), { days: 1 });
  let fixedDate = new Date(2024, 0, 1, 13, 37);

  [todayDate, yesterdayDate, tomorrowDate].forEach((date) =>
    date.setHours(13, 37, 0, 0),
  );

  const todayDateString = format(todayDate, ISO8601DateTimeFormat);
  const yesterdayDateString = format(yesterdayDate, ISO8601DateTimeFormat);
  const tomorrowDateString = format(tomorrowDate, ISO8601DateTimeFormat);

  it.each([
    {
      dateString: todayDateString,
      expected: "Today, 13:37",
    },
    {
      dateString: yesterdayDateString,
      expected: "Yesterday, 13:37",
    },
    {
      dateString: tomorrowDateString,
      expected: "Tomorrow, 13:37",
    },
    {
      dateString: fixedDate,
      expected: "1st Jan 2024, 13:37",
    },
  ])("returns expected result", (data) => {
    const { dateString, expected } = data;
    expect(getFormattedOrderTableDate(dateString)).toBe(expected);
  });
});

describe("The isOrderFlightActive() helper", () => {
  it.each([
    {
      order: { status: ApianTransferStatusCodes.TRANSFER_COMPLETED },
      expected: false,
    },
    {
      order: { status: ApianTransferStatusCodes.TRANSFER_COMPLETED },
      expected: false,
    },
    {
      order: null,
      expected: false,
    },
  ])("returns expected result", (data) => {
    const { order, expected } = data;
    expect(isOrderFlightActive(order)).toBe(expected);
  });
});

const mockOrdersForNextDelivery = [
  {
    sender_location: {
      scheduled_pickup_datetime: todayDateString,
    },
    recipient_location: {
      scheduled_earliest_recipient_arrival_time: todayDateString,
    },
    status: ApianTransferStatusCodes.TRANSFER_COMPLETED,
  },
  {
    sender_location: {
      scheduled_pickup_datetime: todayDateString,
    },
    recipient_location: {
      scheduled_earliest_recipient_arrival_time: todayDateString,
    },
    status: ApianTransferStatusCodes.CONFIRMED_BY_OPERATOR,
  },
  {
    sender_location: {
      scheduled_pickup_datetime: todayDateString,
    },
    recipient_location: {
      scheduled_earliest_recipient_arrival_time: nowPlusOneHourString,
    },
    status: ApianTransferStatusCodes.CONFIRMED_BY_OPERATOR,
  },
  {
    status: ApianTransferStatusCodes.CREATED,
    sender_location: {},
    recipient_location: {
      scheduled_earliest_recipient_arrival_time: nowPlusOneHourString,
    },
  },
  {
    status: ApianTransferStatusCodes.PENDING,
    sender_location: {},
    recipient_location: {},
  },
  {
    status: ApianTransferStatusCodes.IN_TRANSIT_TO_DESTINATION,
    sender_location: {},
    recipient_location: {
      estimated_earliest_recipient_arrival_time: nowPlusOneHourString,
    },
  },
  {
    status: ApianTransferStatusCodes.ORDER_CANCELLED,
    sender_location: {},
    recipient_location: {},
  },
  {
    status: ApianTransferStatusCodes.CANCELLED_BY_OPERATOR,
    sender_location: {},
    recipient_location: {},
  },
  {
    status: ApianTransferStatusCodes.REJECTED_BY_OPERATOR,
    sender_location: {},
    recipient_location: {},
  },
  {
    status: ApianTransferStatusCodes.TRANSFER_FAILED,
    sender_location: {},
    recipient_location: {},
  },
  {
    status: ApianTransferStatusCodes.FAILED_TO_CONNECT_TO_OPERATOR,
    sender_location: {},
    recipient_location: {},
  },
];

describe("The getEstimatedDurationUntilArrivalTimeAsString() helper", () => {
  it.each([
    { order: mockOrdersForNextDelivery[0], expected: "--:--" },
    { order: mockOrdersForNextDelivery[1], expected: `${EST_TXT} 0 min(s)` },
    { order: mockOrdersForNextDelivery[2], expected: `${EST_TXT} 59 min(s)` },
    { order: mockOrdersForNextDelivery[3], expected: `${EST_TXT} 59 min(s)` },
    { order: mockOrdersForNextDelivery[4], expected: "--:--" },
    { order: mockOrdersForNextDelivery[5], expected: `${EST_TXT} 59 min(s)` },
    { order: mockOrdersForNextDelivery[6], expected: "--:--" },
    { order: mockOrdersForNextDelivery[7], expected: "--:--" },
    { order: mockOrdersForNextDelivery[8], expected: "--:--" },
    { order: mockOrdersForNextDelivery[9], expected: "--:--" },
    { order: mockOrdersForNextDelivery[10], expected: "--:--" },
  ])("returns expected result for $expected", (data) => {
    const { order, expected } = data;
    expect(getEstimatedDurationUntilArrivalTimeAsString(order)).toBe(expected);
  });
});

const nowPlusTwoHoursDate = add(new Date(), { hours: 2 });
const nowPlusTwoHoursString = format(
  nowPlusTwoHoursDate,
  ISO8601DateTimeFormat,
);

const tomorrowDate = add(new Date(), { days: 1 });
export const tomorrowDateString = format(tomorrowDate, ISO8601DateTimeFormat);
describe("The getNextOrderEstimatedUntilArrivalTimeFormatted() helper", () => {
  it.each([
    { input: "", expected: "--:--" },
    { input: todayDateString, expected: `${EST_TXT} 0 min(s)` },
    { input: nowPlusOneHourString, expected: `${EST_TXT} 59 min(s)` },
    {
      input: nowPlusTwoHoursString,
      expected: `${EST_TXT} ${nowPlusTwoHoursDate.getHours() < 10 ? "0" + nowPlusTwoHoursDate.getHours() : nowPlusTwoHoursDate.getHours()}:${("0" + nowPlusTwoHoursDate.getMinutes()).slice(-2)}`,
    },
    {
      input: tomorrowDateString,
      expected: `${EST_TXT} Tomorrow, ${tomorrowDate.getHours() < 10 ? "0" + tomorrowDate.getHours() : tomorrowDate.getHours()}:${("0" + tomorrowDate.getMinutes()).slice(-2)}`,
    },
    { input: "2024-01-01T12:00", expected: `${EST_TXT} 1st Jan 2024, 12:00` },
  ])("returns expected result", (data) => {
    const { input, expected } = data;
    expect(getNextOrderEstimatedUntilArrivalTimeFormatted(input)).toBe(
      expected,
    );
  });
});

describe("The isCancellable() helper", () => {
  it.each([
    { status: ApianTransferStatusCodes.CREATED, expected: true },
    { status: ApianTransferStatusCodes.PENDING, expected: true },
    { status: ApianTransferStatusCodes.CONFIRMED_BY_OPERATOR, expected: false },
    {
      status: ApianTransferStatusCodes.IN_TRANSIT_TO_DESTINATION,
      expected: false,
    },
    { status: ApianTransferStatusCodes.TRANSFER_COMPLETED, expected: false },
    { status: ApianTransferStatusCodes.ORDER_CANCELLED, expected: false },
    { status: ApianTransferStatusCodes.CANCELLED_BY_OPERATOR, expected: false },
    { status: ApianTransferStatusCodes.REJECTED_BY_OPERATOR, expected: false },
    { status: ApianTransferStatusCodes.TRANSFER_FAILED, expected: false },
    {
      status: ApianTransferStatusCodes.FAILED_TO_CONNECT_TO_OPERATOR,
      expected: false,
    },
  ])("returns expected results", (data) => {
    const { status, expected } = data;
    const mockOrder = { status: status };
    expect(isCancellable(mockOrder)).toBe(expected);
  });
});

describe("The getOrderStatusEventDatetimeString() helper", () => {
  const testOrder = {
    status_history: [
      {
        status: ApianTransferStatusCodes.CREATED.toString(),
        status_datetime: "mock_created_datetime",
      },
      {
        status: ApianTransferStatusCodes.PENDING.toString(),
        status_datetime: "mock_pending_datetime",
      },
    ],
  };
  it.each([
    {
      status: ApianTransferStatusCodes.CREATED,
      expected: "mock_created_datetime",
    },
    {
      status: ApianTransferStatusCodes.PENDING,
      expected: "mock_pending_datetime",
    },
  ])("returns expected results", (data) => {
    const { status, expected } = data;
    expect(getOrderStatusEventDatetimeString(testOrder, status)).toBe(expected);
  });
});

const testMappings = [
  {
    code: "test_a",
    sender_name: "Test A",
    recipient_location_mappings: [{ name: "Test B", code: "test_b" }],
  },
];

describe("The findMappingsBySenderCode helper", () => {
  it.each([
    { sender_code: "test_a", expected: testMappings[0] },
    { sender_code: "dummy", expected: undefined },
    { sender_code: "", expected: undefined },
  ])("returns expected result", (data) => {
    const { sender_code, expected } = data;
    expect(findMappingsBySenderCode(testMappings, sender_code)).toBe(expected);
  });
});

describe("The checkMappingsForRecipientLocation helper", () => {
  it.each([
    { recipient_code: "test_b", expected: true },
    { recipient_code: "dummy", expected: false },
    { recipient_code: "", expected: false },
  ])("returns expected result", (data) => {
    const { recipient_code, expected } = data;
    expect(
      checkMappingsForRecipientLocation(
        testMappings[0].recipient_location_mappings,
        recipient_code,
      ),
    ).toBe(expected);
  });
});

describe("incrementWeekdays function", () => {
  const testCases = [
    {
      date: new Date("2024-04-10"),
      interval: 1,
      expected: new Date("2024-04-11"),
      startDay: "Wed",
      returnedDay: "Thurs",
    },
    {
      date: new Date("2024-04-10"),
      interval: 2,
      expected: new Date("2024-04-12"),
      startDay: "Wed",
      returnedDay: "Fri",
    },
    {
      date: new Date("2024-04-10"),
      interval: 3,
      expected: new Date("2024-04-15"),
      startDay: "Wed",
      returnedDay: "Mon - skipping weekend",
    },
    {
      date: new Date("2024-04-10"),
      interval: 4,
      expected: new Date("2024-04-16"),
      startDay: "Wed",
      returnedDay: "Tues - skipping weekend",
    },
    {
      date: new Date("2028-02-28"),
      interval: 1,
      expected: new Date("2028-02-29"),
      startDay: "Mon",
      returnedDay: "Tues - handling leap year",
    },
    {
      date: new Date("2028-02-28"),
      interval: 2,
      expected: new Date("2028-03-01"),
      startDay: "Mon",
      returnedDay: "Wed - handling leap year",
    },
    {
      date: new Date("2024-12-31"),
      interval: 1,
      expected: new Date("2025-01-01"),
      startDay: "Tues",
      returnedDay: "Wed - handling new year",
    },
    {
      date: new Date("2024-04-10"),
      interval: 10,
      expected: new Date("2024-04-24"),
      startDay: "Wed",
      returnedDay: "Wed - skipping weekends",
    },
    {
      date: new Date("2024-04-13"),
      interval: 1,
      expected: new Date("2024-04-15"),
      startDay: "Sat",
      returnedDay: "Mon - skipping Sunday",
    },
    {
      date: new Date("2024-04-14"),
      interval: 1,
      expected: new Date("2024-04-15"),
      startDay: "Sun",
      returnedDay: "Mon",
    },
  ];

  it.each(testCases)(
    "starting on $startDay with interval of $interval it returns $returnedDay",
    ({ date, interval, expected }) => {
      const result = incrementWeekdays(date, interval);
      expect(result).toEqual(expected);
    },
  );
});

describe("getRecurringOrderDates function", () => {
  const testCases = [
    {
      selectedPickup: new Date("2024-04-01T01:00:00"),
      selectedCount: 3,
      selectedInterval: 1,
      selectedFrequency: "HOURLY",
      expectedDates: [
        new Date("2024-04-01T01:00:00"),
        new Date("2024-04-01T02:00:00"),
        new Date("2024-04-01T03:00:00"),
      ],
      testDescription: "3 x 1 hourly recurrences",
    },
    {
      selectedPickup: new Date("2024-04-01T23:00:00"),
      selectedCount: 4,
      selectedInterval: 2,
      selectedFrequency: "HOURLY",
      expectedDates: [
        new Date("2024-04-01T23:00:00"),
        new Date("2024-04-02T01:00:00"),
        new Date("2024-04-02T03:00:00"),
        new Date("2024-04-02T05:00:00"),
      ],
      testDescription: "4 x 2 hourly recurrences - handling next day change",
    },
    {
      selectedPickup: new Date("2024-04-10T00:00:00.00"),
      selectedCount: 4,
      selectedInterval: 1,
      selectedFrequency: "WEEKDAYS",
      expectedDates: [
        new Date("2024-04-10T00:00:00.00"),
        new Date("2024-04-11T00:00:00.00"),
        new Date("2024-04-12T00:00:00.00"),
        new Date("2024-04-15T00:00:00.00"),
      ],
      testDescription: "4 x 1 weekdaily recurrences - skipping weekend",
    },
    {
      selectedPickup: new Date("2024-04-10T00:00:00.00"),
      selectedCount: 2,
      selectedInterval: 8,
      selectedFrequency: "WEEKDAYS",
      expectedDates: [
        new Date("2024-04-10T00:00:00.00"),
        new Date("2024-04-22T00:00:00.00"),
      ],
      testDescription: "2 x 8 weekdaily recurrences - skipping weekend",
    },
    {
      selectedPickup: new Date("2024-04-01T00:00:00.00"),
      selectedCount: 7,
      selectedInterval: 1,
      selectedFrequency: "DAILY",
      expectedDates: [
        new Date("2024-04-01T00:00:00.00"),
        new Date("2024-04-02T00:00:00.00"),
        new Date("2024-04-03T00:00:00.00"),
        new Date("2024-04-04T00:00:00.00"),
        new Date("2024-04-05T00:00:00.00"),
        new Date("2024-04-06T00:00:00.00"),
        new Date("2024-04-07T00:00:00.00"),
      ],
      testDescription: "7 x  1 daily recurrences",
    },
    {
      selectedPickup: new Date("2024-02-26T00:00:00.00"),
      selectedCount: 3,
      selectedInterval: 3,
      selectedFrequency: "DAILY",
      expectedDates: [
        new Date("2024-02-26T00:00:00.00"),
        new Date("2024-02-29T00:00:00.00"),
        new Date("2024-03-03T00:00:00.00"),
      ],
      testDescription:
        "3 x 3 daily recurrences - handling leap year and month change",
    },
    {
      selectedPickup: new Date("2024-04-01T00:00:00.00"),
      selectedCount: 3,
      selectedInterval: 1,
      selectedFrequency: "WEEKLY",
      expectedDates: [
        new Date("2024-04-01T00:00:00.00"),
        new Date("2024-04-08T00:00:00.00"),
        new Date("2024-04-15T00:00:00.00"),
      ],
      testDescription: "3 x 1 weekly recurrences",
    },
    {
      selectedPickup: new Date("2024-12-31T00:00:00.00"),
      selectedCount: 2,
      selectedInterval: 2,
      selectedFrequency: "WEEKLY",
      expectedDates: [
        new Date("2024-12-31T00:00:00.00"),
        new Date("2025-01-14T00:00:00.00"),
      ],
      testDescription: "2 x 2 weekly recurrences - handling year change",
    },
  ];

  it.each(testCases)(
    "should correctly calculate recurring order dates for $testDescription",
    ({
      selectedPickup,
      selectedCount,
      selectedInterval,
      selectedFrequency,
      expectedDates,
    }) => {
      const result = getRecurringOrderDates(
        selectedPickup,
        selectedCount,
        selectedInterval,
        selectedFrequency,
      );
      expect(result).toEqual(expectedDates);
    },
  );
});

describe("The findSchedule() helper", () => {
  const scheduleTestCases = [
    {
      dataToTest: {
        code: "A",
        schedule: {
          0: { end: "18:00:00", open: true, start: "08:00:00" },
          1: { end: "18:00:00", open: true, start: "08:00:00" },
          2: { end: "18:00:00", open: true, start: "08:00:00" },
          3: { end: "18:00:00", open: true, start: "08:00:00" },
          4: { end: "18:00:00", open: true, start: "08:00:00" },
          5: { end: "17:00:00", open: false, start: "09:00:00" },
          6: { end: "17:00:00", open: false, start: "09:00:00" },
        },
        schedule_description: "08:00 - 18:00, Monday - Friday",
      },
      expected: {
        schedule: {
          0: { end: "18:00:00", open: true, start: "08:00:00" },
          1: { end: "18:00:00", open: true, start: "08:00:00" },
          2: { end: "18:00:00", open: true, start: "08:00:00" },
          3: { end: "18:00:00", open: true, start: "08:00:00" },
          4: { end: "18:00:00", open: true, start: "08:00:00" },
          5: { end: "17:00:00", open: false, start: "09:00:00" },
          6: { end: "17:00:00", open: false, start: "09:00:00" },
        },
        schedule_description: "08:00 - 18:00, Monday - Friday",
      },
      testDescription: "returns schedule for matching location",
    },
    {
      dataToTest: {
        code: "C",
        schedule: {
          0: { end: "18:00:00", open: true, start: "08:00:00" },
          1: { end: "18:00:00", open: true, start: "08:00:00" },
          2: { end: "18:00:00", open: true, start: "08:00:00" },
          3: { end: "18:00:00", open: true, start: "08:00:00" },
          4: { end: "18:00:00", open: true, start: "08:00:00" },
          5: { end: "17:00:00", open: false, start: "09:00:00" },
          6: { end: "17:00:00", open: false, start: "09:00:00" },
        },
        schedule_description: "09:00 - 17:00, Monday - Friday",
      },
      expected: null,
      testDescription: "returns null for non-matching location",
    },
  ];
  it.each(scheduleTestCases)("$testDescription", (scheduleTestCases) => {
    expect(
      findSchedule(
        scheduleTestCases.dataToTest.code,
        testLocationOptionsWithSchedule,
      ),
    ).toEqual(scheduleTestCases.expected);
  });
});

describe("The findScheduleTime() helper", () => {
  const senderSchedule = {
    schedule: {
      0: { end: "18:30:00", open: true, start: "08:00:00" },
      1: { end: "18:00:00", open: true, start: "00:00:50" },
      2: { end: "18:00:00", open: true, start: "08:00:00" },
      3: { end: "18:00:00", open: true, start: "08:00:00" },
      4: { end: "18:00:00", open: true, start: "08:00:00" },
      5: { end: "17:00:00", open: false, start: "09:00:00" },
      6: { end: "17:00:00", open: false, start: "09:00:00" },
    },
    schedule_description: "08:00 - 18:00, Monday - Friday",
  };

  const testCases = [
    {
      day: 0,
      dayRef: "start",
      timeRef: "hours",
      expected: 8,
      testDescription:
        "returns correct number of hours for opening time Monday",
    },
    {
      day: 0,
      dayRef: "start",
      timeRef: "minutes",
      expected: 0,
      testDescription:
        "returns correct number of minutes for opening time Monday",
    },
    {
      day: 0,
      dayRef: "end",
      timeRef: "hours",
      expected: 18,
      testDescription:
        "returns correct number of hours for closing time Monday",
    },
    {
      day: 0,
      dayRef: "end",
      timeRef: "minutes",
      expected: 30,
      testDescription:
        "returns correct number of minutes for closing time Monday",
    },
    {
      day: 1,
      dayRef: "start",
      timeRef: "hours",
      expected: 0,
      testDescription:
        "returns correct number of hours for opening time Tuesday - handling midnight",
    },
    {
      day: 1,
      dayRef: "start",
      timeRef: "minutes",
      expected: 0,
      testDescription:
        "returns correct number of minutes for opening time Tuesday - handling seconds and ignoring them",
    },
  ];

  it.each(testCases)(
    "$testDescription",
    ({ day, dayRef, timeRef, expected }) => {
      expect(findScheduleTime(senderSchedule, day, dayRef, timeRef)).toBe(
        expected,
      );
    },
  );
});

describe("the reassignDayFromSunToMonWeekStart() helper", () => {
  const testCases = [
    {
      inputDay: 0,
      expected: 6,
    },
    {
      inputDay: 1,
      expected: 0,
    },
    {
      inputDay: 2,
      expected: 1,
    },
    {
      inputDay: 3,
      expected: 2,
    },
    {
      inputDay: 4,
      expected: 3,
    },
    {
      inputDay: 5,
      expected: 4,
    },
    {
      inputDay: 6,
      expected: 5,
    },
  ];
  it.each(testCases)(
    "correctly reassigns $inputDay to $expected",
    ({ inputDay, expected }) => {
      expect(reassignDayFromSunToMonWeekStart(inputDay)).toEqual(expected);
    },
  );
});

describe("the getTimeFromSchedule() helper", () => {
  const testCases = [
    {
      senderSchedule: mockSenderScheduleDiffTimes,
      timeRef: "start",
      date: recurringOrderDates[0],
      expected: mockWedHours[0],
      testDescription: "returns correct start time for 08:00-18:00",
    },
    {
      senderSchedule: mockSenderScheduleDiffTimes,
      timeRef: "end",
      date: recurringOrderDates[0],
      expected: mockWedHours[1],
      testDescription: "returns correct end time for 08:00-18:00",
    },
    {
      senderSchedule: mockSenderScheduleDiffTimes,
      timeRef: "start",
      date: recurringOrderDates[1],
      expected: mockThursHours[0],
      testDescription: "returns correct start time for 00:00-23:00",
    },
    {
      senderSchedule: mockSenderScheduleDiffTimes,
      timeRef: "end",
      date: recurringOrderDates[1],
      expected: mockThursHours[1],
      testDescription: "returns correct end time for 00:00-23:59",
    },
    {
      senderSchedule: mockSenderScheduleDiffTimes,
      timeRef: "start",
      date: recurringOrderDates[2],
      expected: mockFriHours[0],
      testDescription: "returns correct start time for 10:10-11:50",
    },
    {
      senderSchedule: mockSenderScheduleDiffTimes,
      timeRef: "end",
      date: recurringOrderDates[2],
      expected: mockFriHours[1],
      testDescription: "returns correct end time for 10:10-11:50",
    },
    {
      senderSchedule: mockSenderScheduleDiffTimes,
      timeRef: "start",
      date: recurringOrderDates[3],
      expected: mockSatHours[0],
      testDescription: "returns correct start time for 09:30-17:45",
    },
    {
      senderSchedule: mockSenderScheduleDiffTimes,
      timeRef: "end",
      date: recurringOrderDates[3],
      expected: mockSatHours[1],
      testDescription: "returns correct end time for 09:30-17:45",
    },
    {
      senderSchedule: mockSenderScheduleDiffTimes,
      timeRef: "start",
      date: new Date(2028, 1, 29),
      expected: new Date(2028, 1, 29, 12, 30, 0, 0),
      testDescription:
        "returns correct start time for 12:30-16:30 - handles leap year",
    },
    {
      senderSchedule: mockSenderScheduleDiffTimes,
      timeRef: "end",
      date: new Date(2028, 1, 29),
      expected: new Date(2028, 1, 29, 16, 30, 0, 0),
      testDescription:
        "returns correct end time for 12:30-16:30 - handles leap year",
    },
  ];

  it.each(testCases)(
    "$testDescription",
    ({ senderSchedule, timeRef, date, expected }) => {
      expect(getTimeFromSchedule(senderSchedule, timeRef, date)).toEqual(
        expected,
      );
    },
  );
});

describe("the getOpeningHours() helper", () => {
  const testCases = [
    {
      senderSchedule: mockSenderScheduleDiffTimes,
      date: recurringOrderDates[0],
      expected: mockWedHours,
      testDescription: "returns correct opening hours for 08:00-18:00",
    },
    {
      senderSchedule: mockSenderScheduleDiffTimes,
      date: recurringOrderDates[1],
      expected: mockThursHours,
      testDescription: "returns correct opening hours for 00:00-23:59",
    },
    {
      senderSchedule: mockSenderScheduleDiffTimes,
      date: recurringOrderDates[2],
      expected: mockFriHours,
      testDescription: "returns correct opening hours for 10:10-11:50",
    },
    {
      senderSchedule: mockSenderScheduleDiffTimes,
      date: recurringOrderDates[3],
      expected: mockSatHours,
      testDescription: "returns correct opening hours for 09:30-17:45",
    },
    {
      senderSchedule: mockSenderScheduleDiffTimes,
      date: new Date(2028, 1, 29),
      expected: [
        new Date(2028, 1, 29, 12, 30, 0, 0),
        new Date(2028, 1, 29, 16, 30, 0, 0),
      ],
      testDescription:
        "returns correct opening hours for 12:30-16:30 - handles leap year",
    },
  ];

  it.each(testCases)(
    "$testDescription",
    ({ senderSchedule, date, expected }) => {
      expect(getOpeningHours(senderSchedule, date)).toEqual(expected);
    },
  );
});

describe("the checkDayAgainstSchedule() helper", () => {
  const testCases = [
    {
      senderSchedule: mockSenderSchedule,
      date: recurringOrderDates[0],
      expected: {
        date: recurringOrderDates[0],
        errorSchedule: false,
        errorMaxDays: false,
      },
      testDescription: "returns date and no error",
    },
    {
      senderSchedule: mockSenderSchedule,
      date: recurringOrderDates[2],
      expected: {
        date: recurringOrderDates[2],
        errorSchedule: true,
        errorMaxDays: false,
      },
      testDescription: "returns date and error",
    },
    {
      senderSchedule: mockSenderScheduleWeekend,
      date: recurringOrderDates[3],
      expected: {
        date: recurringOrderDates[3],
        errorSchedule: false,
        errorMaxDays: false,
      },
      testDescription: "returns date and no error",
    },
  ];

  it.each(testCases)(
    "$testDescription",
    ({ expected, date, senderSchedule }) => {
      expect(checkDayAgainstSchedule(senderSchedule, date)).toEqual(expected);
    },
  );
});

describe("the checkOrdersAgainstSchedule() helper", () => {
  const testCases = [
    {
      senderSchedule: mockSenderSchedule,
      dates: recurringOrderDates,
      expected: {
        numOrdersWithError: 2,
        ordersList: [
          {
            date: recurringOrderDates[0],
            errorSchedule: false,
            errorMaxDays: false,
          },
          {
            date: recurringOrderDates[1],
            errorSchedule: false,
            errorMaxDays: false,
          },
          {
            date: recurringOrderDates[2],
            errorSchedule: true,
            errorMaxDays: false,
          },
          {
            date: recurringOrderDates[3],
            errorSchedule: true,
            errorMaxDays: false,
          },
        ],
      },
      testDescription:
        "returns correct orders list and error count - within 14 day limit",
    },
    {
      senderSchedule: mockSenderScheduleWeekend,
      dates: recurringOrderDates,
      expected: {
        numOrdersWithError: 3,
        ordersList: [
          {
            date: recurringOrderDates[0],
            errorSchedule: true,
            errorMaxDays: false,
          },
          {
            date: recurringOrderDates[1],
            errorSchedule: true,
            errorMaxDays: false,
          },
          {
            date: recurringOrderDates[2],
            errorSchedule: true,
            errorMaxDays: false,
          },
          {
            date: recurringOrderDates[3],
            errorSchedule: false,
            errorMaxDays: false,
          },
        ],
      },
      testDescription:
        "returns correct orders list and error count - within 14 day limit",
    },
    {
      senderSchedule: mockSenderScheduleDiffTimes,
      dates: recurringOrderDatesPlusOneMonth,
      expected: {
        numOrdersWithError: 4,
        ordersList: [
          {
            date: recurringOrderDatesPlusOneMonth[0],
            errorSchedule: false,
            errorMaxDays: true,
          },
          {
            date: recurringOrderDatesPlusOneMonth[1],
            errorSchedule: false,
            errorMaxDays: true,
          },
          {
            date: recurringOrderDatesPlusOneMonth[2],
            errorSchedule: true,
            errorMaxDays: true,
          },
          {
            date: recurringOrderDatesPlusOneMonth[3],
            errorSchedule: false,
            errorMaxDays: true,
          },
        ],
      },
      testDescription:
        "returns correct orders list and error count - orders over 14 days in future",
    },
  ];

  it.each(testCases)(
    "$testDescription",
    ({ expected, dates, senderSchedule }) => {
      expect(checkOrdersAgainstSchedule(senderSchedule, dates)).toEqual(
        expected,
      );
    },
  );
});

describe("getOrderArrivalTimeAsString function", () => {
  it.each([
    {
      order: {
        recipient_location: {
          scheduled_earliest_recipient_arrival_time: new Date(
            "December 17, 2023 10:00:00",
          ),
          scheduled_latest_recipient_arrival_time: new Date(
            "December 17, 2023 10:10:00",
          ),
        },
        status: ApianTransferStatusCodes.PENDING,
      },
      expected: NO_TIME,
    },
    {
      order: {
        recipient_location: {
          scheduled_earliest_recipient_arrival_time: new Date(
            "December 17, 2023 10:00:00",
          ),
          scheduled_latest_recipient_arrival_time: new Date(
            "December 17, 2023 10:10:00",
          ),
        },
        status: ApianTransferStatusCodes.CREATED,
      },
      expected: "17th Dec 2023, 10:00 - 10:10",
    },
    {
      order: {
        recipient_location: {
          scheduled_earliest_recipient_arrival_time: setMinutes(
            setHours(new Date(), 1),
            0,
          ),
          scheduled_latest_recipient_arrival_time: setMinutes(
            setHours(new Date(), 2),
            0,
          ),
        },
        status: ApianTransferStatusCodes.CREATED,
      },
      expected: "01:00 - 02:00",
    },
    {
      order: {
        recipient_location: {
          scheduled_earliest_recipient_arrival_time: setMinutes(
            setHours(new Date(tomorrowDateString), 1),
            0,
          ),
          scheduled_latest_recipient_arrival_time: setMinutes(
            setHours(new Date(tomorrowDateString), 2),
            0,
          ),
        },
        status: ApianTransferStatusCodes.CREATED,
      },
      expected: "Tomorrow, 01:00 - 02:00",
    },
    {
      order: {
        recipient_location: {
          scheduled_earliest_recipient_arrival_time: setMinutes(
            setHours(new Date(tomorrowDateString), 1),
            0,
          ),
          scheduled_latest_recipient_arrival_time: setMinutes(
            setHours(new Date(tomorrowDateString), 2),
            0,
          ),
        },
        status: ApianTransferStatusCodes.CONFIRMED_BY_OPERATOR,
      },
      expected: "Tomorrow, 01:00 - 02:00",
    },
    {
      order: {
        recipient_location: {
          estimated_earliest_recipient_arrival_time: setMinutes(
            setHours(new Date(tomorrowDateString), 2),
            0,
          ),
        },
        status: ApianTransferStatusCodes.IN_TRANSIT_TO_DESTINATION,
      },
      expected: "est. Tomorrow, 02:00",
    },
    {
      order: {
        recipient_location: {
          estimated_earliest_recipient_arrival_time: setMinutes(
            setHours(new Date(), 2),
            0,
          ),
        },
        status: ApianTransferStatusCodes.IN_TRANSIT_TO_DESTINATION,
      },
      expected: "est. 02:00",
    },
    {
      order: {
        destination_location: {
          actual_destination_arrival_time: setMinutes(
            setHours(new Date(), 2),
            0,
          ),
        },
        status: ApianTransferStatusCodes.TRANSFER_COMPLETED,
      },
      expected: "Today, 02:00",
    },
    {
      order: {
        destination_location: {
          actual_destination_arrival_time: new Date(
            "December 17, 2023 10:00:00",
          ),
        },
        status: ApianTransferStatusCodes.TRANSFER_COMPLETED,
      },
      expected: "17th Dec 2023, 10:00",
    },
    {
      order: {
        status: ApianTransferStatusCodes.CANCELLED_BY_OPERATOR,
      },
      expected: NO_TIME,
    },
    {
      order: {
        status: ApianTransferStatusCodes.TRANSFER_FAILED,
      },
      expected: NO_TIME,
    },
    {
      order: {
        status: ApianTransferStatusCodes.ORDER_CANCELLED,
      },
      expected: NO_TIME,
    },
  ])(
    "displays correct arrival and format time of orders for status $order.status",
    ({ order, expected }) => {
      const time = getOrderArrivalTimeAsString(order);
      expect(time).toEqual(expected);
    },
  );
});
describe("The getSimilarWarningsMessages() helper returns expected result", () => {
  it("for just one similar order with same scheduled time", () => {
    const testSimilarOrders = [
      {
        time_diff_min: 0,
        pickup_time: "00:00",
      },
    ];
    const [title, text] = getSimilarWarningsMessages(testSimilarOrders);
    expect(title).toContain(SIMILAR_ORDER_ALERT_TITLE);
    expect(text).toContain(SIMILAR_ORDER_MSG_TXT);
    expect(text).toContain(SIMILAR_ORDER_QUESTION_TXT);
  });

  it("for just one similar order within the similar window", () => {
    const testSimilarOrders = [
      {
        time_diff_min: -5,
        pickup_time: "12:00",
      },
    ];
    const [title, text] = getSimilarWarningsMessages(testSimilarOrders);
    expect(title).toContain(SIMILAR_ORDER_ALERT_TITLE);
    expect(text).toContain(SIMILAR_ORDER_AT_MSG_TXT);
    expect(text).toContain(SIMILAR_ORDER_QUESTION_TXT);
  });

  it("for more then 1 similar order but at the same time (no time diff)", () => {
    const testSimilarOrders = [
      {
        time_diff_min: 0,
        pickup_time: "12:00",
      },
      {
        time_diff_min: 0,
        pickup_time: "12:00",
      },
    ];
    const [title, text] = getSimilarWarningsMessages(testSimilarOrders);
    expect(title).toContain(SIMILAR_ORDERS_ALERT_TITLE);
    expect(text).toContain(
      testSimilarOrders.length + " " + SIMILAR_NUM_ORDERS_MSG_TXT,
    );
    expect(text).toContain(SIMILAR_ORDER_QUESTION_TXT);
  });

  it("for more then 1 similar order but only 1 at the same time", () => {
    const testSimilarOrders = [
      {
        time_diff_min: 0,
        pickup_time: "12:00",
      },
      {
        time_diff_min: -10,
        pickup_time: "11:50",
      },
    ];
    const [title, text] = getSimilarWarningsMessages(testSimilarOrders);
    expect(title).toContain(SIMILAR_ORDERS_ALERT_TITLE);
    expect(text).toContain(SIMILAR_ORDER_MSG_TXT);
    expect(text).toContain(SIMILAR_ORDER_QUESTION_TXT);
  });

  it.each([
    {
      similarOrderWarnings: [
        {
          time_diff_min: 5,
          pickup_time: "12:05",
        },
        {
          time_diff_min: 2,
          pickup_time: "12:02",
        },
        {
          time_diff_min: -10,
          pickup_time: "11:50",
        },
      ],
    },
    {
      similarOrderWarnings: [
        {
          time_diff_min: -2,
          pickup_time: "11:58",
        },
        {
          time_diff_min: 10,
          pickup_time: "12:10",
        },
      ],
    },
  ])("for more then 1 similar order but none the same time", (data) => {
    const { similarOrderWarnings } = data;
    const [title, text] = getSimilarWarningsMessages(
      similarOrderWarnings,
      null,
    );
    expect(title).toContain(SIMILAR_ORDERS_ALERT_TITLE);
    expect(text).toContain(
      similarOrderWarnings.length + " " + SIMILAR_NUM_ORDERS_INCLUDING_MSG_TXT,
    );
    expect(text).toContain(SIMILAR_ORDER_QUESTION_TXT);
  });
});

describe("The getSimilarOrderDayString()", () => {
  it("returns expected result for today", () => {
    expect(getSimilarOrderDayString(new Date())).toBe("today");
  });

  it("returns expected result for tomorrow", () => {
    expect(getSimilarOrderDayString(add(new Date(), { days: 1 }))).toBe(
      "tomorrow",
    );
  });

  it("returns expected result 5 days from now", () => {
    const futureDate = add(new Date(), { days: 5 });
    const dayText = format(futureDate, dayOrdinalShortMonthFormat);
    expect(getSimilarOrderDayString(futureDate)).toBe(dayText);
    expect(getSimilarOrderDayString(futureDate, true)).toContain("on");
  });
});

describe("The getOrderDeliveryDayString() helper", () => {
  it.each([
    {
      order: {
        recipient_location: {
          scheduled_earliest_recipient_arrival_time: "dummy",
        },
      },
      expected: NO_TIME,
    },
    {
      order: {
        recipient_location: {
          scheduled_earliest_recipient_arrival_time: todayDateString,
        },
      },
      expected: "Today",
    },
    {
      order: {
        recipient_location: {
          scheduled_earliest_recipient_arrival_time: tomorrowDateString,
        },
      },
      expected: "Tomorrow",
    },
    {
      order: {
        recipient_location: {
          scheduled_earliest_recipient_arrival_time: new Date(
            "2024-01-01 12:00",
          ),
        },
      },
      expected: "1st Jan 2024",
    },
  ])("returns expected result", (data) => {
    const { order, expected } = data;
    expect(getOrderDeliveryDayString(order)).toBe(expected);
  });
});

describe("The getOrderScheduledArrivalTimeString() helper", () => {
  const arrivalTestDate = new Date();
  const laterArrivalDate = add(arrivalTestDate, { minutes: 30 });
  it.each([
    {
      order: {
        recipient_location: {
          estimated_earliest_recipient_arrival_time: arrivalTestDate,
        },
      },
      expected: `est. ${formatWithDefaultTimeZone(arrivalTestDate, TwentyFourHourFormat)}`,
    },
    {
      order: {
        recipient_location: {
          scheduled_earliest_recipient_arrival_time: arrivalTestDate,
          scheduled_latest_recipient_arrival_time: laterArrivalDate,
        },
      },
      expected: `${formatWithDefaultTimeZone(arrivalTestDate, TwentyFourHourFormat)} - ${formatWithDefaultTimeZone(laterArrivalDate, TwentyFourHourFormat)}`,
    },
    {
      order: {
        recipient_location: {
          scheduled_earliest_recipient_arrival_time: "",
          scheduled_latest_recipient_arrival_time: "",
        },
      },
      expected: noDataMessage,
    },
  ])("returns expected result", (data) => {
    const { order, expected } = data;
    expect(getOrderScheduledArrivalTimeString(order)).toBe(expected);
  });
});
