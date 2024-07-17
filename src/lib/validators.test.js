import { describe, expect, it } from "@jest/globals";
import { setHours, setMinutes } from "date-fns";

import {
  locationsMockData,
  mockSenderSchedule,
  recurringOrderDates,
  recurringOrderDatesPlusOneMonth,
} from "./testHelpers/mockData";
import * as errorMessages from "./errorMessages";
import {
  chainValidate,
  validateDateIsBeforeMax,
  validateFutureDate,
  validateNotEquals,
  validateNumberInput,
  validateNumberIsBetween,
  validatePickupDateIsWithinPermittedWindow,
  validateValueIsNotEmpty,
} from "./validators";
describe("Validation Functions", () => {
  describe("validateNotEquals", () => {
    it.each([
      {
        itemA: locationsMockData[0].code,
        itemB: locationsMockData[0].code,
        expected: errorMessages.SENDER_RECIPIENT_EQUAL_ERROR_MSG,
        condition: "equal",
      },
      {
        itemA: locationsMockData[1].code,
        itemB: locationsMockData[0].code,
        expected: true,
        condition: "different",
      },
      {
        itemA: locationsMockData[0].code,
        itemB: locationsMockData[0].code.toUpperCase(),
        expected: errorMessages.SENDER_RECIPIENT_EQUAL_ERROR_MSG,
        condition: "equal, ignoring case",
      },
      {
        itemA: locationsMockData[0].code,
        itemB: ` ${locationsMockData[0].code} `,
        expected: errorMessages.SENDER_RECIPIENT_EQUAL_ERROR_MSG,
        condition: "equal, ignoring trailing/leading spaces",
      },
    ])(
      "when items are $condition it should return $expected",
      ({ itemA, itemB, expected }) => {
        const result = validateNotEquals(
          itemA,
          itemB,
          errorMessages.SENDER_RECIPIENT_EQUAL_ERROR_MSG,
        );
        expect(result).toBe(expected);
      },
    );
  });

  describe("validateFutureDate", () => {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    it.each([
      {
        date: "2023-01-01",
        expected: errorMessages.DATE_IN_PAST_ERROR_MSG,
        condition: "date is in the past",
      },
      {
        date: futureDate.toISOString(),
        expected: true,
        condition: "date is in the future",
      },
      {
        date: "I'm not a date",
        expected: errorMessages.INVALID_DATE_ERROR_MSG,
        condition: "it is not a valid date format",
      },
    ])("when $condition it should return $expected", ({ date, expected }) => {
      const result = validateFutureDate(date);
      expect(result).toBe(expected);
    });
  });

  describe("chainValidate", () => {
    const errorMessage = "error message";
    it.each([
      {
        validators: [() => true, () => errorMessage, () => true],
        expected: errorMessage,
        condition: "at least one validator returns an error",
      },
      {
        validators: [() => errorMessage, () => errorMessage],
        expected: errorMessage,
        condition: "all validators returns an error",
      },

      {
        validators: [() => true, () => true, () => true],
        expected: true,
        condition: "all validators pass",
      },
    ])(
      "when $condition it should return $expected",
      ({ validators, expected }) => {
        const result = chainValidate(validators);
        expect(result).toBe(expected);
      },
    );
  });

  describe("validateValueIsNotEmpty", () => {
    it.each([
      {
        value: null,
        label: errorMessages.NO_SENDER_ERROR_MSG,
        expected: errorMessages.NO_SENDER_ERROR_MSG,
        condition: "value is null",
      },
      {
        value: "",
        label: errorMessages.NO_RECIPIENT_ERROR_MSG,
        expected: errorMessages.NO_RECIPIENT_ERROR_MSG,
        condition: "value is an empty string",
      },
      {
        value: "I have value",
        label: errorMessages.NO_RECIPIENT_ERROR_MSG,
        expected: true,
        condition: "value is a string",
      },
      {
        value: 23,
        label: errorMessages.NO_SENDER_ERROR_MSG,
        expected: true,
        condition: "value is a number",
      },
      {
        value: true,
        label: errorMessages.NO_DATE_TIME_ERROR_MSG,
        expected: true,
        condition: "value is the boolean true",
      },
      {
        value: false,
        label: errorMessages.NO_DATE_TIME_ERROR_MSG,
        expected: errorMessages.NO_DATE_TIME_ERROR_MSG,
        condition: "value is the boolean false",
      },
      {
        value: undefined,
        label: errorMessages.NO_SENDER_ERROR_MSG,
        expected: errorMessages.NO_SENDER_ERROR_MSG,
        condition: "value is undefined",
      },
    ])(
      "when $condition it should return $expected",
      ({ value, label, expected }) => {
        const result = validateValueIsNotEmpty(value, label);
        expect(result).toBe(expected);
      },
    );
  });

  describe("validateNumberInput", () => {
    const errorMessageReq = "Field is required";

    it("should validate required field", () => {
      const validation = validateNumberInput(1, 10);
      const result = validation.required;

      expect(result.value).toBe(true);
      expect(result.message).toBe(errorMessageReq);
    });

    it("should validate minimum value", () => {
      const validation = validateNumberInput(5, 15);
      const result = validation.min;

      expect(result.value).toBe(5);
      expect(result.message).toBe("Minimum value is 5");
    });

    it("should validate maximum value", () => {
      const validation = validateNumberInput(5, 15);
      const result = validation.max;

      expect(result.value).toBe(15);
      expect(result.message).toBe("Maximum value is 15");
    });

    it("should validate value as number", () => {
      const validation = validateNumberInput(1, 10);

      expect(validation.valueAsNumber).toBe(true);
    });
  });

  describe("validateNumberIsBetween", () => {
    it.each([
      {
        min: 0,
        max: 10,
        numberToValidate: 5,
        expected: true,
        condition: "number is within the range",
      },
      {
        min: 0,
        max: 10,
        numberToValidate: 15,
        minErrorMsg: "Number must be greater than or equal to 0",
        maxErrorMsg: "Number must be less than or equal to 10",
        expected: "Number must be less than or equal to 10",
        condition: "number is greater than the max",
      },
      {
        min: 0,
        max: 10,
        numberToValidate: -5,
        minErrorMsg: "Number must be greater than or equal to 0",
        maxErrorMsg: "Number must be less than or equal to 10",
        expected: "Number must be greater than or equal to 0",
        condition: "number is less than the min",
      },
      {
        min: 0,
        max: 10,
        numberToValidate: "hello",
        expected: "Must be a number",
        condition: "number is NaN",
      },
      {
        min: 0,
        max: 10,
        numberToValidate: "3",
        expected: true,
        condition: "number is inside a string",
      },
    ])(
      "when $condition it should return $expected",
      ({ min, max, numberToValidate, minErrorMsg, maxErrorMsg, expected }) => {
        const result = validateNumberIsBetween(
          min,
          max,
          numberToValidate,
          minErrorMsg,
          maxErrorMsg,
        );
        expect(result).toBe(expected);
      },
    );
  });
});

describe("validatePickupDateIsWithinPermittedWindow", () => {
  it.each([
    {
      departureDate: setMinutes(setHours(new Date(2024, 3, 24), 10), 30),
      senderSchedule: mockSenderSchedule,
      expected: true,
      condition: "date is within schedule",
    },
    {
      departureDate: new Date(2024, 3, 24),
      senderSchedule: null,
      expected: true,
      condition: "senderSchedule is null",
    },
    {
      departureDate: new Date(2024, 3, 27),
      senderSchedule: mockSenderSchedule,
      expected: `${errorMessages.SCHEDULED_REC_ORDERS_ERROR_MSG} ${mockSenderSchedule.schedule_description}`,
      condition: "date is outside of permitted schedule",
    },
  ])(
    "it should return $expected when $condition",
    ({ departureDate, senderSchedule, expected }) => {
      const result = validatePickupDateIsWithinPermittedWindow(
        departureDate,
        senderSchedule,
      );
      expect(result).toBe(expected);
    },
  );
});

describe("validateDateIsBeforeMax", () => {
  it.each([
    {
      date: recurringOrderDates[0],
      days: 14,
      errorMsg: errorMessages.DAY_CONSTRAINT_ERROR_MSG,
      expected: true,
      condition: "date is within max number of days",
    },
    {
      date: recurringOrderDatesPlusOneMonth[2],
      days: 14,
      errorMsg: errorMessages.DAY_CONSTRAINT_ERROR_MSG,
      expected: errorMessages.DAY_CONSTRAINT_ERROR_MSG,
      condition:
        "returns error message when given and outside number of max days",
    },
    {
      date: recurringOrderDatesPlusOneMonth[2],
      days: 14,
      errorMsg: null,
      expected: false,
      condition:
        "returns false when no error message when given and outside number of max days",
    },
  ])("it $condition", ({ date, days, expected, errorMsg }) => {
    const result = validateDateIsBeforeMax(date, days, errorMsg);
    expect(result).toBe(expected);
  });
});
