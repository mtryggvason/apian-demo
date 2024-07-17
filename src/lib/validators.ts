"use client";

import { addDays, endOfToday, isBefore } from "date-fns";

import {
  DATE_IN_PAST_ERROR_MSG,
  INVALID_DATE_ERROR_MSG,
  SCHEDULED_REC_ORDERS_ERROR_MSG,
} from "@/lib/errorMessages";
import { checkOrdersAgainstSchedule } from "@/lib/orderHelpers";
import { SenderPermittedWindowInfo } from "@/lib/types/location";

type ErrorMsg = string;
type ValidationOutput = true | ErrorMsg;

export const validateNotEquals = (
  itemA: string,
  itemB: string,
  errorMessage: string,
): ValidationOutput => {
  const lowercaseItemA = itemA.trim().toLowerCase();
  const lowercaseItemB = itemB.trim().toLowerCase();

  return lowercaseItemA !== lowercaseItemB ? true : errorMessage;
};

export const validateFutureDate = (
  departureDate: string | Date,
): ValidationOutput => {
  const selectedDate = new Date(departureDate);
  const currentDate = new Date();
  //this isn't part of the error messages in the PRD, just wondering how I should handle this?
  //I don't think anything other than a date can be submitted though, but wanted to ask
  if (isNaN(selectedDate.getTime())) {
    return INVALID_DATE_ERROR_MSG;
  }

  if (selectedDate <= currentDate) {
    return DATE_IN_PAST_ERROR_MSG;
  }

  return true;
};

export const validateDateIsBeforeMax = (
  date: Date | string,
  days: number,
  errorMsg?: string,
): string | boolean => {
  const selectedDate = new Date(date);
  const today = endOfToday();
  const futureDateLimit = addDays(today, days);

  const isValid = isBefore(selectedDate, futureDateLimit);

  if (isValid) {
    return true;
  } else {
    return errorMsg ?? false;
  }
};

export const validatePickupDateIsWithinPermittedWindow = (
  departureDate: string | Date,
  senderSchedule: SenderPermittedWindowInfo | null,
): ValidationOutput => {
  const selectedDate = new Date(departureDate);

  if (!senderSchedule) {
    return true; // No sender schedule, no validation needed against it
  }

  const checkedDate = checkOrdersAgainstSchedule(senderSchedule, [
    selectedDate,
  ]);

  if (checkedDate.ordersList[0].errorSchedule) {
    return `${SCHEDULED_REC_ORDERS_ERROR_MSG} ${senderSchedule.schedule_description}`;
  }

  return true;
};

export const chainValidate = (validators: Array<any>): ValidationOutput => {
  for (let index = 0; index < validators.length; index++) {
    const validator = validators[index];
    const value = validator();
    if (typeof value === "string") {
      return value;
    }
  }
  return true;
};

export const validateNumberInput = (minValue: number, maxValue: number) => ({
  valueAsNumber: true,
  required: { value: true, message: "Field is required" },
  min: { value: minValue, message: `Minimum value is ${minValue}` },
  max: { value: maxValue, message: `Maximum value is ${maxValue}` },
});

export const validateValueIsNotEmpty = <T>(
  value: T,
  errorMessage: string,
): ValidationOutput => {
  if (!value) {
    return errorMessage;
  }
  return true;
};

export const validateNumberIsBetween = (
  min: number,
  max: number,
  numberToValidate: number | string,
  minErrorMsg: string,
  maxErrorMsg: string,
): true | string => {
  let parsedNumber: number;

  if (typeof numberToValidate === "number") {
    parsedNumber = numberToValidate;
  } else {
    parsedNumber = parseInt(numberToValidate);

    if (isNaN(parsedNumber)) {
      return "Must be a number";
    }
  }
  if (parsedNumber < min) return minErrorMsg;
  if (parsedNumber > max) return maxErrorMsg;
  return true;
};
