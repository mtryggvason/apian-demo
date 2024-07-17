import {
  add,
  addDays,
  addMinutes,
  Duration,
  format,
  isAfter,
  isBefore,
  isToday,
  isTomorrow,
  isValid,
  parse,
  startOfToday,
  startOfTomorrow,
  startOfYesterday,
} from "date-fns";
import { formatInTimeZone, getTimezoneOffset } from "date-fns-tz";

import {
  DateAtHourFormat,
  ISO8601_DATE_TIME_FORMAT_WITH_TIMEZONE,
  ISO8601DateTimeFormat,
  LongDateFormat,
  NO_TIME,
  ShortDayMonth,
  TwentyFourHourFormat,
} from "./constants/timeConstants";

export const formatWithDefaultTimeZone = (
  date: string | Date | null | undefined,
  format: string,
  timezone = "Europe/London"
) => {
  if (date) {
    const isValidDate = isValid(new Date(date));

    if (isValidDate) {
      return formatInTimeZone(date, timezone, format);
    }
  }
  return NO_TIME;
};

export const todayDateString = formatWithDefaultTimeZone(
  new Date(),
  ISO8601DateTimeFormat
);

export const yesterdayDateString = formatWithDefaultTimeZone(
  add(new Date(), { days: -1 }),
  ISO8601DateTimeFormat
);

export const nowPlusOneHourString = formatWithDefaultTimeZone(
  add(new Date(), { hours: 1 }),
  ISO8601DateTimeFormat
);

export const datetimeOptionLong: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "long",
  day: "numeric",
};

export const datetimeOptionLongWithDay: Intl.DateTimeFormatOptions = {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
};

export const getFormattedDateTime = (datetime: Date): string => {
  // Returns datetime in "%Y-%m-%d %H:%M:%S" format.
  return (
    datetime.getFullYear() +
    "-" +
    (datetime.getMonth() + 1).toString().padStart(2, "0") +
    "-" +
    datetime.getDate().toString().padStart(2, "0") +
    " " +
    datetime.getHours().toString().padStart(2, "0") +
    ":" +
    datetime.getMinutes().toString().padStart(2, "0") +
    ":" +
    datetime.getSeconds().toString().padStart(2, "0")
  );
};

export const getFormattedDate = (datetime: Date): string => {
  // Returns datetime in "%Y-%m-%d" format.

  return (
    datetime.getFullYear() +
    "-" +
    (datetime.getMonth() + 1).toString().padStart(2, "0") +
    "-" +
    datetime.getDate().toString().padStart(2, "0")
  );
};

export const getFormattedLongDate = (datetime: Date): string => {
  //returns date in format e.g December 31, 2023
  return formatWithDefaultTimeZone(datetime, "MMMM d, yyyy");
};

export const getFormattedLongDateWithDay = (datetime: Date): string => {
  //returns date in format e.g Thursday, 23 November 2023
  return datetime.toLocaleDateString(undefined, datetimeOptionLongWithDay);
};

export const getLongDateString = (date: Date): string => {
  //returns date in format - Wednesday 1st January 2020
  return formatWithDefaultTimeZone(date, LongDateFormat);
};

export const getDateAtHourDateString = (date: Date): string => {
  // returns date in format - 15/01/2024 at 13:37
  return formatWithDefaultTimeZone(date, DateAtHourFormat);
};

export const getFormattedTableTime = (
  dataDateTime: string | null | undefined,
  noDataMessage: string
): string => {
  //fn used to return only the time to render in the table when on the main transfer schedule page
  return !isValidDate(dataDateTime)
    ? noDataMessage
    : formatWithDefaultTimeZone(new Date(dataDateTime!), TwentyFourHourFormat);
};

export const getFormattedDatetimeString = (
  dataDateTime: string | null | undefined,
  dateFormat: string,
  noDataMessage: string
): string => {
  return !isValidDate(dataDateTime)
    ? noDataMessage
    : formatWithDefaultTimeZone(new Date(dataDateTime!), dateFormat);
};

export const convertDateTimeToLondon = (
  date: string | Date | null | undefined
) => {
  if (date) {
    const isValidDate = date && isValid(new Date(date));

    if (isValidDate) {
      return formatInTimeZone(
        date,
        "Europe/London",
        ISO8601_DATE_TIME_FORMAT_WITH_TIMEZONE
      );
    }
  }
  return NO_TIME;
};

export const getCurrentEpochTime = () => {
  return Math.floor(new Date().getTime() / 1000);
};

export const isDateBetween = (
  targetDate: Date,
  startDate?: Date,
  endDate?: Date
) => {
  if (!targetDate) {
    return false;
  }
  if (!startDate && !endDate) {
    return true;
  }

  if (!startDate || !isValidDate(startDate.toString())) {
    return isBefore(targetDate, endDate!);
  }

  if (!endDate || !isValidDate(endDate.toString())) {
    return isAfter(targetDate, startDate);
  }
  return isAfter(targetDate, startDate) && isBefore(targetDate, endDate);
};

export const isValidDate = (dateString: string | null | undefined) => {
  if (!dateString) {
    return false;
  }
  const date = new Date(Date.parse(dateString));
  return !isNaN(date as any);
};

export function getWeekNumberAndYear(date: Date): {
  weekNumber: number;
  year: number;
} {
  const newDate = new Date(date);

  // Setting the date to Monday of the current week to ensure the correct week number
  newDate.setHours(0, 0, 0, 0);
  newDate.setDate(newDate.getDate() + 4 - (newDate.getDay() || 7));

  // Getting the year and week number
  const year = newDate.getFullYear();
  const startOfYear = new Date(year, 0, 1);
  const weekNumber = Math.ceil(
    ((newDate.getTime() - startOfYear.getTime()) / 86400000 + 1) / 7
  );

  return { weekNumber, year };
}

export const getPrevDate = (date: Date): Date => {
  return addDays(date, -1);
};

export const getNextDate = (date: Date): Date => {
  return addDays(date, 1);
};

export const minutesToDuration = (inputMinutes: number): string => {
  const hours = Math.floor(inputMinutes / 60);
  const minutes = Math.floor(inputMinutes % 60);
  const seconds = Math.round(((inputMinutes % 60) - minutes) * 60);
  return `${hours !== 0 ? hours + "h " : ""}${
    minutes !== 0 ? minutes + "m " : ""
  }${seconds !== 0 && hours === 0 ? seconds + "s" : ""}`.trim();
};

export const getIntervalAsString = (
  dateFrom: Date,
  duration: Duration,
  dateFormat: string
) => {
  const dateTo = add(dateFrom, duration);
  return `${formatWithDefaultTimeZone(
    dateFrom,
    dateFormat
  )} - ${formatWithDefaultTimeZone(dateTo, dateFormat)}`;
};

export const isDateStringAfterStartOfToday = (dateString: string): boolean => {
  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);
  const dateStringDate = new Date(dateString);

  const todayTimestamp = todayDate.getTime();
  const inputTimestamp = dateStringDate.getTime();

  return inputTimestamp > todayTimestamp;
};

export const isSameDate = (date1: Date, date2: Date): boolean =>
  date1.getDate() === date2.getDate() &&
  date1.getMonth() === date2.getMonth() &&
  date1.getFullYear() === date2.getFullYear();

export const isTodayOrTomorrow = (
  datetime: Date
): { isToday: boolean; isTomorrow: boolean } => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  return {
    isToday: isSameDate(datetime, today),
    isTomorrow: isSameDate(datetime, tomorrow),
  };
};

export const getFormattedTableDateString = (
  date: string | null | undefined,
  includeTime: boolean,
  dateFormat: string = ShortDayMonth,
  defaultTimeZone: boolean = true
): string => {
  if (date) {
    const datetime = new Date(date);
    const { isToday, isTomorrow } = isTodayOrTomorrow(datetime);
    const formatter = defaultTimeZone ? formatWithDefaultTimeZone : format;
    const formattedFullDate = formatter(datetime, dateFormat);

    let dateString = `${formattedFullDate}, `;
    if (isToday) {
      dateString = "Today, ";
    } else if (isTomorrow) {
      dateString = "Tomorrow, ";
    }

    return includeTime
      ? `${dateString}${formatter(datetime, "HH:mm")}`
      : dateString;
  }
  return NO_TIME;
};

export function constrain(value: Date, minDate?: Date, maxDate?: Date) {
  const tempDate = new Date(value.getTime());
  if (maxDate) {
    tempDate.setHours(maxDate.getHours());
    tempDate.setMinutes(maxDate.getMinutes());
    if (isAfter(value, tempDate)) {
      return tempDate;
    }
  }

  if (minDate) {
    tempDate.setHours(minDate.getHours());
    tempDate.setMinutes(minDate.getMinutes());
    if (isBefore(value, tempDate)) {
      return tempDate;
    }
  }
  return value;
}

export function constrainTime(value: Date, minTime?: Date, maxTime?: Date) {
  const maxDate = maxTime ? adjustDateToTime(value, maxTime) : undefined;
  const minDate = minTime ? adjustDateToTime(value, minTime) : undefined;
  return constrain(value, minDate, maxDate);
}

export function adjustDateToTime(date: Date, time: Date) {
  const tempDate = new Date(date.getTime());
  tempDate.setHours(time.getHours());
  tempDate.setMinutes(time.getMinutes());
  return tempDate;
}

/**
 * Should be used in the app, where we are formatting dates that we received from the server.
 * @param date
 * @param timezone
 * @returns  Date that has the ISO time that matches the one from the provided timezone
 */
export function adjustTimezoneOffSetToUTC(
  date: Date,
  timezone = "Europe/London"
) {
  // Get the current timezone offset
  // Multiply by -1 since we get how UTC is relative to our timezone
  const currentOffsetMinutes = -1 * date.getTimezoneOffset();

  // Get the to timezone offset in milliseconds
  const londonOffsetMilliseconds = getTimezoneOffset(timezone, new Date());
  const londonOffsetMinutes = Math.ceil(londonOffsetMilliseconds / 60000);

  const offsetMinutes = currentOffsetMinutes - londonOffsetMinutes;
  const returnDate = addMinutes(date, offsetMinutes);
  return returnDate;
}

export const parseFormattedTableDateTime = (
  formattedString: string,
  hasDate: boolean
) => {
  const today = startOfToday();
  const tomorrow = startOfTomorrow();
  const yesterday = startOfYesterday();
  if (formattedString === NO_TIME) return null;

  // Remove "est. "  if it exists
  formattedString = formattedString.replace("est. ", "");

  const lowerCaseString = formattedString.toLowerCase();
  //only use start of time for sorting - if range exists
  const [startTime] = lowerCaseString.split(" - ");
  const [hours, minutes] = extractStartTime(startTime);

  if (lowerCaseString.startsWith("today"))
    return new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      hours,
      minutes
    );
  if (lowerCaseString.startsWith("tomorrow"))
    return new Date(
      tomorrow.getFullYear(),
      tomorrow.getMonth(),
      tomorrow.getDate(),
      hours,
      minutes
    );
  if (lowerCaseString.startsWith("yesterday"))
    return new Date(
      yesterday.getFullYear(),
      yesterday.getMonth(),
      yesterday.getDate(),
      hours,
      minutes
    );

  if (hasDate) {
    return parse(startTime, "do MMMM yyyy, HH:mm", new Date());
  } else {
    // If there's no date, we use today's date (to sort the time strings with no date in daily schedule page)
    const [hours, minutes] = extractStartTime(startTime);
    return new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      hours,
      minutes
    );
  }
};

export const extractStartTime = (timeStr: string): [number, number] => {
  // Match the time string against the pattern "HH:mm"
  const timeMatch = timeStr.match(/(\d{2}):(\d{2})/);

  if (timeMatch) {
    // Extract and parse hours and minutes from the match
    const hours = parseInt(timeMatch[1], 10);
    const minutes = parseInt(timeMatch[2], 10);
    return [hours, minutes];
  }

  // If the match fails, return default [0, 0]
  return [0, 0];
};

export const getCasualDateFormatString = (date: Date): string => {
  if (!isValid(date)) {
    return NO_TIME;
  }
  if (isToday(date)) {
    return "Today";
  } else if (isTomorrow(date)) {
    return "Tomorrow";
  } else {
    return formatWithDefaultTimeZone(date, ShortDayMonth);
  }
};
