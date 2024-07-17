import {
  addMilliseconds,
  differenceInMinutes,
  getDay,
  isSaturday,
  isSunday,
  isToday,
  isTomorrow,
  isValid,
  isWithinInterval,
  isYesterday,
  setHours,
  setMinutes,
} from "date-fns";

const noDataMessage = '"';
import {
  ApianTransferStatusCodes,
  upcomingTransferStatus,
} from "@/lib/constants/apianTransferStatuses";
import {
  EARLIER_TXT,
  EST_TXT,
  LATER_TXT,
  SIMILAR_NUM_ORDERS_INCLUDING_MSG_TXT,
  SIMILAR_NUM_ORDERS_MSG_TXT,
  SIMILAR_ORDER_ALERT_TITLE,
  SIMILAR_ORDER_AT_MSG_TXT,
  SIMILAR_ORDER_MSG_TXT,
  SIMILAR_ORDER_QUESTION_TXT,
  SIMILAR_ORDERS_ALERT_TITLE,
} from "@/lib/constants/pageTextConstants";
import {
  dayOrdinalShortMonthFormat,
  MAX_DAYS_CREATE_ORDER,
  MS_IN_ONE_DAY,
  MS_IN_ONE_HOUR,
  NO_TIME,
  ShortDayMonth24HourFormat,
  TwentyFourHourFormat,
} from "@/lib/constants/timeConstants";
import {
  formatWithDefaultTimeZone,
  getCasualDateFormatString,
  getFormattedTableDateString,
  isDateStringAfterStartOfToday,
} from "@/lib/dateHelpers";
import { RecurringOrderFrequency } from "@/lib/enums";
import { CheckedOrder, DayNumber } from "@/lib/types";
import {
  LocationOptionsProps,
  SenderPermittedWindowInfo,
  SenderRecipientLocationMapping,
} from "@/lib/types/location";
import {
  OrderDetailItem,
  OrderListItem,
  SimilarOrderWarning,
} from "@/lib/types/order";
import { validateDateIsBeforeMax } from "@/lib/validators";

const nextOrderDeliveryActiveStatus = [
  ApianTransferStatusCodes.IN_TRANSIT_TO_DESTINATION,
];

export const isOrderFlightActive = (
  order: OrderListItem | OrderDetailItem | null
): boolean => {
  if (!order) {
    return false;
  }
  return nextOrderDeliveryActiveStatus.includes(+order.status);
};

export const isUpcomingOrder = (order: OrderListItem): boolean => {
  if (
    isDateStringAfterStartOfToday(
      order.sender_location.scheduled_pickup_datetime
    )
  ) {
    // orders share status with transfers
    return upcomingTransferStatus.includes(+order.status);
  }
  // "yesterday" orders are never upcoming
  return false;
};

export const isPreviousOrder = (order: OrderListItem): boolean => {
  if (
    isDateStringAfterStartOfToday(
      order.sender_location.scheduled_pickup_datetime
    )
  ) {
    return !upcomingTransferStatus.includes(+order.status);
  }
  // "yesterday" orders are always previous
  return true;
};

export const isCancellable = (order: OrderDetailItem): boolean => {
  return [
    ApianTransferStatusCodes.CREATED,
    ApianTransferStatusCodes.PENDING,
  ].includes(+order.status);
};

export const isCompleted = (order: OrderDetailItem): boolean => {
  return [ApianTransferStatusCodes.TRANSFER_COMPLETED].includes(+order.status);
};

export const getOrderDeliveryDayString = (order: OrderListItem): string => {
  const orderDate = new Date(
    order.recipient_location.scheduled_earliest_recipient_arrival_time!
  );
  return getCasualDateFormatString(orderDate);
};

export const getFormattedOrderTableDate = (dateString: string) => {
  const date = new Date(dateString);
  if (!isValid(date) || !dateString) {
    return NO_TIME;
  }
  if (isToday(date)) {
    return `Today, ${formatWithDefaultTimeZone(date, TwentyFourHourFormat)}`;
  } else if (isTomorrow(date)) {
    return `Tomorrow, ${formatWithDefaultTimeZone(date, TwentyFourHourFormat)}`;
  } else if (isYesterday(date)) {
    return `Yesterday, ${formatWithDefaultTimeZone(
      date,
      TwentyFourHourFormat
    )}`;
  } else {
    return formatWithDefaultTimeZone(date, ShortDayMonth24HourFormat);
  }
};

type OrderTime = {
  [key in ApianTransferStatusCodes]: (
    o: OrderListItem | OrderDetailItem
  ) => string;
};

export const OrderDurationUntilArrivalTimes: OrderTime = {
  [ApianTransferStatusCodes.CREATED]: (
    order: OrderListItem | OrderDetailItem
  ) =>
    getNextOrderEstimatedUntilArrivalTimeFormatted(
      order.recipient_location.scheduled_earliest_recipient_arrival_time!
    ),
  [ApianTransferStatusCodes.PENDING]: () => NO_TIME,
  [ApianTransferStatusCodes.CONFIRMED_BY_OPERATOR]: (
    order: OrderListItem | OrderDetailItem
  ) => {
    return getNextOrderEstimatedUntilArrivalTimeFormatted(
      order.recipient_location.scheduled_earliest_recipient_arrival_time!
    );
  },

  [ApianTransferStatusCodes.IN_TRANSIT_TO_DESTINATION]: (
    order: OrderListItem | OrderDetailItem
  ) =>
    getNextOrderEstimatedUntilArrivalTimeFormatted(
      order.recipient_location.estimated_earliest_recipient_arrival_time!
    ),
  [ApianTransferStatusCodes.TRANSFER_COMPLETED]: (
    order: OrderListItem | OrderDetailItem
  ) => {
    return getNextOrderEstimatedUntilArrivalTimeFormatted(
      order.recipient_location.estimated_earliest_recipient_arrival_time!,
      true
    );
  },
  [ApianTransferStatusCodes.ORDER_CANCELLED]: () => NO_TIME,
  [ApianTransferStatusCodes.CANCELLED_BY_OPERATOR]: () => NO_TIME,
  [ApianTransferStatusCodes.REJECTED_BY_OPERATOR]: () => NO_TIME,
  [ApianTransferStatusCodes.TRANSFER_FAILED]: () => NO_TIME,
  [ApianTransferStatusCodes.FAILED_TO_CONNECT_TO_OPERATOR]: () => NO_TIME,
};

export const getEstimatedDurationUntilArrivalTimeAsString = (
  order: OrderListItem | OrderDetailItem
) => {
  if (order.status) {
    return OrderDurationUntilArrivalTimes[
      order.status as ApianTransferStatusCodes
    ](order);
  }
  return NO_TIME;
};

export const getOrderScheduledArrivalTimeString = (order: OrderListItem) => {
  if (order.recipient_location.estimated_earliest_recipient_arrival_time) {
    return `est. ${formatWithDefaultTimeZone(
      order.recipient_location.estimated_earliest_recipient_arrival_time,
      TwentyFourHourFormat
    )}`;
  }
  return order.recipient_location.scheduled_earliest_recipient_arrival_time &&
    order.recipient_location.scheduled_latest_recipient_arrival_time
    ? `${formatWithDefaultTimeZone(
        order.recipient_location.scheduled_earliest_recipient_arrival_time,
        TwentyFourHourFormat
      )} - ${formatWithDefaultTimeZone(
        order.recipient_location.scheduled_latest_recipient_arrival_time,
        TwentyFourHourFormat
      )}`
    : noDataMessage;
};

export const getScheduledOrderArrival = (
  order: OrderDetailItem | OrderListItem
) => {
  if (
    !isValid(
      new Date(
        order.recipient_location.scheduled_earliest_recipient_arrival_time!
      )
    ) ||
    !isValid(
      new Date(
        order.recipient_location.scheduled_latest_recipient_arrival_time!
      )
    )
  ) {
    return NO_TIME;
  }
  const earliestDepartureTime = new Date(
    order.recipient_location.scheduled_earliest_recipient_arrival_time!
  );
  const latesDepartureTime = new Date(
    order.recipient_location.scheduled_latest_recipient_arrival_time!
  );

  const interval = `${formatWithDefaultTimeZone(
    earliestDepartureTime,
    "HH:mm"
  )} - ${formatWithDefaultTimeZone(latesDepartureTime, "HH:mm")}`;
  if (isToday(earliestDepartureTime)) {
    return interval;
  } else if (isTomorrow(earliestDepartureTime)) {
    return `Tomorrow, ${interval}`;
  }
  return `${getFormattedTableDateString(
    order.recipient_location.scheduled_earliest_recipient_arrival_time!,
    false
  )}${interval}`;
};

export function getOrderStatusEventDatetimeString(
  order: OrderDetailItem,
  status: ApianTransferStatusCodes
): string | undefined {
  const historyEvent = order.status_history.find(
    (historyItem) => historyItem.status === status.toString()
  );
  return historyEvent?.status_datetime;
}

export const getOrderArrivalTimeAsString = (
  order: OrderListItem | OrderDetailItem
) => {
  return OrderArrivalTimes[order.status as unknown as ApianTransferStatusCodes](
    order
  );
};

export function getNextOrderEstimatedUntilArrivalTimeFormatted(
  inputDateString: string,
  isKnownTime: boolean = false
): string {
  if (!inputDateString) {
    return NO_TIME;
  }
  const inputDate = new Date(inputDateString);
  const currentDate = new Date();
  const diffInMinutes = differenceInMinutes(inputDate, currentDate);
  const est = EST_TXT + " ";

  if (diffInMinutes >= 0 && diffInMinutes <= 60) {
    return `${est}${diffInMinutes} min(s)`;
  } else if (isToday(inputDate)) {
    return `${isKnownTime ? "" : est}${formatWithDefaultTimeZone(
      inputDate,
      TwentyFourHourFormat
    )}`;
  } else if (isTomorrow(inputDate)) {
    return `${isKnownTime ? "" : est}Tomorrow, ${formatWithDefaultTimeZone(
      inputDate,
      TwentyFourHourFormat
    )}`;
  } else {
    return `${isKnownTime ? "" : est}${formatWithDefaultTimeZone(
      inputDate,
      ShortDayMonth24HourFormat
    )}`;
  }
}

export const OrderArrivalTimes: OrderTime = {
  [ApianTransferStatusCodes.CREATED]: (
    order: OrderListItem | OrderDetailItem
  ) => getScheduledOrderArrival(order),

  [ApianTransferStatusCodes.PENDING]: () => NO_TIME,
  [ApianTransferStatusCodes.CONFIRMED_BY_OPERATOR]: (
    order: OrderListItem | OrderDetailItem
  ) => getScheduledOrderArrival(order),
  [ApianTransferStatusCodes.IN_TRANSIT_TO_DESTINATION]: (
    order: OrderListItem | OrderDetailItem
  ) =>
    getNextOrderEstimatedUntilArrivalTimeFormatted(
      order.recipient_location.estimated_earliest_recipient_arrival_time!
    ),
  [ApianTransferStatusCodes.TRANSFER_COMPLETED]: (
    order: OrderListItem | OrderDetailItem
  ) =>
    getFormattedOrderTableDate(
      order.destination_location.actual_destination_arrival_time!
    ),
  [ApianTransferStatusCodes.ORDER_CANCELLED]: () => NO_TIME,
  [ApianTransferStatusCodes.CANCELLED_BY_OPERATOR]: () => NO_TIME,
  [ApianTransferStatusCodes.REJECTED_BY_OPERATOR]: () => NO_TIME,
  [ApianTransferStatusCodes.TRANSFER_FAILED]: () => NO_TIME,
  [ApianTransferStatusCodes.FAILED_TO_CONNECT_TO_OPERATOR]: () => NO_TIME,
};

export const findMappingsBySenderCode = (
  mappings: SenderRecipientLocationMapping[],
  code: string
) => {
  return mappings.find((mapping) => mapping.code === code);
};

export const checkMappingsForRecipientLocation = (
  recipient_mappings: { code: string; name: string }[],
  code: string
) => {
  return recipient_mappings.some((mapping) => mapping.code === code);
};

export function incrementWeekdays(date: Date, interval: number) {
  let scheduledDate = new Date(date);

  for (let i = 0; i < interval; i++) {
    // Move to the next day
    scheduledDate = addMilliseconds(scheduledDate, MS_IN_ONE_DAY);

    // Check if the scheduled date is a Saturday or Sunday
    while (isSaturday(scheduledDate) || isSunday(scheduledDate)) {
      // If it's a weekend day, skip to the next day
      scheduledDate = addMilliseconds(scheduledDate, MS_IN_ONE_DAY);
    }
  }

  return scheduledDate;
}
export function getRecurringOrderDates(
  selectedPickup: Date,
  selectedCount: number,
  selectedInterval: number,
  selectedFrequency: RecurringOrderFrequency
): Date[] {
  const scheduledDatesList: Date[] = [];
  let scheduledDate = new Date(selectedPickup);

  for (let i = 0; i < selectedCount; i++) {
    scheduledDatesList.push(new Date(scheduledDate));
    switch (selectedFrequency) {
      case "HOURLY":
        scheduledDate = addMilliseconds(
          scheduledDate,
          selectedInterval * MS_IN_ONE_HOUR
        );
        break;
      case "WEEKDAYS":
        const nextWeekday = incrementWeekdays(scheduledDate, selectedInterval);
        scheduledDate = nextWeekday;
        break;
      case "DAILY":
        scheduledDate = addMilliseconds(
          scheduledDate,
          selectedInterval * MS_IN_ONE_DAY
        );
        break;
      case "WEEKLY":
        scheduledDate = addMilliseconds(
          scheduledDate,
          selectedInterval * 7 * MS_IN_ONE_DAY
        );
        break;
    }
  }
  return scheduledDatesList;
}

export const findSchedule = (
  senderLocation: string,
  senderLocationOptions: LocationOptionsProps[]
) => {
  const selectedOption = senderLocationOptions.find(
    (option) => option.code === senderLocation
  );
  if (selectedOption) {
    return {
      schedule: selectedOption.schedule,
      schedule_description: selectedOption.schedule_description,
    };
  } else {
    return null;
  }
};

export function findScheduleTime(
  senderSchedule: SenderPermittedWindowInfo,
  day: 0 | 1 | 2 | 3 | 4 | 5 | 6,
  dayRef: "start" | "end",
  timeRef: "hours" | "minutes"
) {
  const timeString = senderSchedule.schedule[day][dayRef];
  const [hours, minutes] = timeString
    .split(":")
    .map((str) => parseInt(str, 10));

  return timeRef === "hours" ? hours : minutes;
}

export function reassignDayFromSunToMonWeekStart(day: DayNumber) {
  const correctedDayNumber: Record<DayNumber, DayNumber> = {
    0: 6,
    1: 0,
    2: 1,
    3: 2,
    4: 3,
    5: 4,
    6: 5,
  };
  return correctedDayNumber[day];
}

export function getTimeFromSchedule(
  senderSchedule: SenderPermittedWindowInfo,
  timeRef: "start" | "end",
  date: Date
) {
  const day = reassignDayFromSunToMonWeekStart(getDay(date) as any);
  const hour = findScheduleTime(senderSchedule, day, timeRef, "hours");
  const minutes = findScheduleTime(senderSchedule, day, timeRef, "minutes");

  return setMinutes(setHours(date, hour), minutes);
}

export function getOpeningHours(
  senderSchedule: SenderPermittedWindowInfo | null,
  date: Date
): [Date, Date] {
  const minTime = senderSchedule
    ? getTimeFromSchedule(senderSchedule, "start", date)
    : setHours(setMinutes(date, 0), 9);
  const maxTime = senderSchedule
    ? getTimeFromSchedule(senderSchedule, "end", date)
    : setHours(setMinutes(date, 0), 17);
  return [minTime, maxTime];
}

export function checkDayAgainstSchedule(
  senderSchedule: SenderPermittedWindowInfo,
  date: Date
): CheckedOrder {
  const day = reassignDayFromSunToMonWeekStart(getDay(date) as any);
  const hasMaxDaysError = !validateDateIsBeforeMax(date, MAX_DAYS_CREATE_ORDER);

  if (!senderSchedule.schedule[day].open) {
    return { date: date, errorSchedule: true, errorMaxDays: hasMaxDaysError };
  } else {
    const startTime = getTimeFromSchedule(senderSchedule, "start", date);
    const endTime = getTimeFromSchedule(senderSchedule, "end", date);

    const hasTimeError = !isWithinInterval(date, {
      start: startTime,
      end: endTime,
    });

    return {
      date,
      errorSchedule: hasTimeError,
      errorMaxDays: hasMaxDaysError,
    };
  }
}

export function checkOrdersAgainstSchedule(
  senderSchedule: SenderPermittedWindowInfo,
  recurringOrderDates: Date[]
) {
  const ordersList: CheckedOrder[] = [];
  let numOrdersWithError = 0;

  recurringOrderDates.forEach((date) => {
    const orderResult = checkDayAgainstSchedule(senderSchedule, date);
    ordersList.push(orderResult);
    if (orderResult.errorSchedule || orderResult.errorMaxDays) {
      numOrdersWithError++;
    }
  });

  return { ordersList, numOrdersWithError };
}

export function getSimilarOrderDayString(
  inputDate: Date,
  includeOn: boolean = false
) {
  if (isToday(inputDate)) {
    return `today`;
  } else if (isTomorrow(inputDate)) {
    return `tomorrow`;
  } else {
    return `${includeOn ? "on " : ""}${formatWithDefaultTimeZone(
      inputDate,
      dayOrdinalShortMonthFormat
    )}`;
  }
}

function buildSingleWarningTextMessage(
  warning: SimilarOrderWarning,
  similarDate: Date
): string {
  if (warning.time_diff_min === 0) {
    return SIMILAR_ORDER_MSG_TXT;
  }

  const whenSuffix = warning.time_diff_min < 0 ? EARLIER_TXT : LATER_TXT;
  return `${SIMILAR_ORDER_AT_MSG_TXT} ${getSimilarOrderDayString(
    similarDate
  )} at ${warning.pickup_time} (${Math.abs(
    warning.time_diff_min
  )} minutes ${whenSuffix})`;
}

function buildMultipleWarningsTextMessage(
  warning: SimilarOrderWarning,
  totalSimilar: number,
  similarDate: Date
): string {
  const whenSuffix = warning.time_diff_min < 0 ? EARLIER_TXT : LATER_TXT;
  return `${totalSimilar} ${SIMILAR_NUM_ORDERS_INCLUDING_MSG_TXT} ${getSimilarOrderDayString(
    similarDate,
    true
  )}, including at ${warning.pickup_time} (${Math.abs(
    warning.time_diff_min
  )} minutes ${whenSuffix})`;
}

export function getSimilarWarningsMessages(
  warnings: SimilarOrderWarning[],
  pickupDate: Date | null
) {
  // This helper will build the title and text messages
  // to use in the similar order warning panel
  let title = "";
  let text = "";
  if (!pickupDate) {
    pickupDate = new Date();
  }
  if (warnings.length) {
    title =
      warnings.length === 1
        ? SIMILAR_ORDER_ALERT_TITLE
        : SIMILAR_ORDERS_ALERT_TITLE;

    const numExactSimilar: number = warnings.filter(
      (warning: SimilarOrderWarning) => warning.time_diff_min === 0
    ).length;
    const numOtherSimilar: number = warnings.length - numExactSimilar;

    if (numExactSimilar + numOtherSimilar === 1) {
      // only one similar order, might be the exact time or not
      text = buildSingleWarningTextMessage(warnings[0], pickupDate);
    } else {
      if (numExactSimilar === 0) {
        // several similar orders, but none at the same exact time
        // find the closest to the requested time and build custom message
        const closestToZero = warnings.reduce((acc, warning) => {
          const currentDiff = Math.abs(warning.time_diff_min);
          const previousDiff = Math.abs(acc.time_diff_min);
          return currentDiff < previousDiff ? warning : acc;
        }, warnings[0]);
        text = buildMultipleWarningsTextMessage(
          closestToZero,
          warnings.length,
          pickupDate
        );
      } else if (numExactSimilar === 1) {
        // retrieve the order with the same time, might not be the first
        const exactSimilarOrder = warnings.filter(
          (warning: SimilarOrderWarning) => warning.time_diff_min === 0
        )[0];
        text = buildSingleWarningTextMessage(exactSimilarOrder, pickupDate);
      } else if (numExactSimilar >= 2) {
        // several orders for the same exact time
        text = `${warnings.length} ${SIMILAR_NUM_ORDERS_MSG_TXT}`;
      }
    }

    // Always include the "Place anyway" question at the end
    text += `\n ${SIMILAR_ORDER_QUESTION_TXT}`;
  }

  return [title, text];
}
