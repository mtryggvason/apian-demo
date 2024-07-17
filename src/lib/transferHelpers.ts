import { isBefore } from "date-fns";

import { ApianTransferStatusCodes } from "./constants/apianTransferStatuses";
import {
  dayOrdinalShortMonthFormat,
  NO_TIME,
  ShortDayMonth,
  TwentyFourHourFormat,
} from "./constants/timeConstants";
import { Transfer, TransferDetails } from "./types/transfer";

import {
  formatWithDefaultTimeZone,
  getFormattedTableDateString,
  getFormattedTableTime,
} from "./dateHelpers";

const noDataMessage = "NO DATA";
export const getDepartureTimeAsString = (transfer: TransferDetails) => {
  return TransferDepartureTimes[
    transfer.status as unknown as ApianTransferStatusCodes
  ](transfer);
};

export const getArrivalTimeAsString = (transfer: TransferDetails) => {
  return TransferArrivalTimes[
    transfer.status as unknown as ApianTransferStatusCodes
  ](transfer);
};

export const getScheduledDepartureTime = (transfer: TransferDetails) => {
  if (
    transfer.estimated_earliest_source_departure_time &&
    transfer.estimated_latest_source_departure_time
  ) {
    return `est. ${formatWithDefaultTimeZone(
      transfer.estimated_earliest_source_departure_time,
      TwentyFourHourFormat
    )} - ${formatWithDefaultTimeZone(
      transfer.estimated_latest_source_departure_time,
      TwentyFourHourFormat
    )}`;
  }
  return transfer.scheduled_earliest_source_departure_time &&
    transfer.scheduled_latest_source_departure_time
    ? `${formatWithDefaultTimeZone(
        transfer.scheduled_earliest_source_departure_time,
        TwentyFourHourFormat
      )} - ${formatWithDefaultTimeZone(
        transfer.scheduled_latest_source_departure_time,
        TwentyFourHourFormat
      )}`
    : noDataMessage;
};

export const getScheduledDepartureIncDate = (
  transfer: TransferDetails,
  dateFormat: string = ShortDayMonth
) =>
  transfer.scheduled_earliest_source_departure_time
    ? getFormattedTableDateString(
        transfer.scheduled_earliest_source_departure_time,
        false,
        dateFormat
      ) + getScheduledDepartureTime(transfer)
    : noDataMessage;

export const getEstimatedArrivalTime = (transfer: TransferDetails) =>
  getFormattedTableTime(
    transfer.estimated_earliest_destination_arrival_time,
    NO_TIME
  );

export const getScheduledArrival = (transfer: TransferDetails) => {
  if (
    transfer.estimated_earliest_destination_arrival_time &&
    transfer.estimated_latest_destination_arrival_time
  ) {
    return `est. ${formatWithDefaultTimeZone(
      transfer.estimated_earliest_destination_arrival_time,
      TwentyFourHourFormat
    )} - ${formatWithDefaultTimeZone(
      transfer.estimated_latest_destination_arrival_time,
      TwentyFourHourFormat
    )}`;
  }
  return transfer.scheduled_earliest_destination_arrival_time &&
    transfer.scheduled_latest_destination_arrival_time
    ? `${formatWithDefaultTimeZone(
        transfer.scheduled_earliest_destination_arrival_time,
        TwentyFourHourFormat
      )} - ${formatWithDefaultTimeZone(
        transfer.scheduled_latest_destination_arrival_time,
        TwentyFourHourFormat
      )}`
    : noDataMessage;
};

export const getScheduledArrivalIncDate = (transfer: TransferDetails) =>
  transfer.scheduled_earliest_destination_arrival_time &&
  transfer.scheduled_latest_destination_arrival_time
    ? getFormattedTableDateString(
        transfer.scheduled_earliest_destination_arrival_time,
        false
      ) + getScheduledArrival(transfer)
    : noDataMessage;

type TransferTime = {
  [key in ApianTransferStatusCodes]: (t: TransferDetails) => string;
};

export const TransferDepartureTimes: TransferTime = {
  [ApianTransferStatusCodes.CREATED]: (transfer: TransferDetails) =>
    getScheduledDepartureTime(transfer),
  [ApianTransferStatusCodes.PENDING]: () => NO_TIME,
  [ApianTransferStatusCodes.CONFIRMED_BY_OPERATOR]: (
    transfer: TransferDetails
  ) => getScheduledDepartureTime(transfer),
  [ApianTransferStatusCodes.IN_TRANSIT_TO_DESTINATION]: (
    transfer: TransferDetails
  ) => getFormattedTableTime(transfer.actual_source_departure_time, NO_TIME),
  [ApianTransferStatusCodes.TRANSFER_COMPLETED]: (transfer: TransferDetails) =>
    getFormattedTableTime(transfer.actual_source_departure_time, NO_TIME),
  [ApianTransferStatusCodes.ORDER_CANCELLED]: (transfer: TransferDetails) =>
    getScheduledDepartureTime(transfer),
  [ApianTransferStatusCodes.CANCELLED_BY_OPERATOR]: (
    transfer: TransferDetails
  ) => getScheduledDepartureTime(transfer),
  [ApianTransferStatusCodes.REJECTED_BY_OPERATOR]: (
    transfer: TransferDetails
  ) => getScheduledDepartureTime(transfer),
  [ApianTransferStatusCodes.TRANSFER_FAILED]: (transfer: TransferDetails) =>
    getFormattedTableTime(transfer.actual_source_departure_time, NO_TIME),
  [ApianTransferStatusCodes.FAILED_TO_CONNECT_TO_OPERATOR]: (
    transfer: TransferDetails
  ) => getScheduledDepartureTime(transfer),
};

export const TransferArrivalTimes: TransferTime = {
  [ApianTransferStatusCodes.CREATED]: (transfer: TransferDetails) =>
    getScheduledArrival(transfer),

  [ApianTransferStatusCodes.PENDING]: () => NO_TIME,
  [ApianTransferStatusCodes.CONFIRMED_BY_OPERATOR]: (
    transfer: TransferDetails
  ) => getScheduledArrival(transfer),
  [ApianTransferStatusCodes.IN_TRANSIT_TO_DESTINATION]: (
    transfer: TransferDetails
  ) =>
    `est. ${getFormattedTableTime(
      transfer.estimated_earliest_destination_arrival_time,
      NO_TIME
    )}`,
  [ApianTransferStatusCodes.TRANSFER_COMPLETED]: (transfer: TransferDetails) =>
    getFormattedTableTime(transfer.actual_destination_arrival_time, NO_TIME),
  [ApianTransferStatusCodes.ORDER_CANCELLED]: () => NO_TIME,
  [ApianTransferStatusCodes.CANCELLED_BY_OPERATOR]: () => NO_TIME,
  [ApianTransferStatusCodes.REJECTED_BY_OPERATOR]: () => NO_TIME,
  [ApianTransferStatusCodes.TRANSFER_FAILED]: () => NO_TIME,
  [ApianTransferStatusCodes.FAILED_TO_CONNECT_TO_OPERATOR]: () => NO_TIME,
};

export const getDepartureDateAndTimeAsString = (transfer: TransferDetails) => {
  return TransferDepartureDateAndTimes[
    transfer.status as unknown as ApianTransferStatusCodes
  ](transfer);
};

export const TransferDepartureDateAndTimes: TransferTime = {
  [ApianTransferStatusCodes.CREATED]: (transfer: TransferDetails) =>
    getScheduledDepartureIncDate(transfer),
  [ApianTransferStatusCodes.PENDING]: () => NO_TIME,
  [ApianTransferStatusCodes.CONFIRMED_BY_OPERATOR]: (
    transfer: TransferDetails
  ) => getScheduledDepartureIncDate(transfer),
  [ApianTransferStatusCodes.IN_TRANSIT_TO_DESTINATION]: (
    transfer: TransferDetails
  ) => getFormattedTableDateString(transfer.actual_source_departure_time, true),
  [ApianTransferStatusCodes.TRANSFER_COMPLETED]: (transfer: TransferDetails) =>
    getFormattedTableDateString(transfer.actual_source_departure_time, true),
  [ApianTransferStatusCodes.ORDER_CANCELLED]: () => NO_TIME,
  [ApianTransferStatusCodes.CANCELLED_BY_OPERATOR]: () => NO_TIME,
  [ApianTransferStatusCodes.REJECTED_BY_OPERATOR]: () => NO_TIME,
  [ApianTransferStatusCodes.TRANSFER_FAILED]: () => NO_TIME,
  [ApianTransferStatusCodes.FAILED_TO_CONNECT_TO_OPERATOR]: () => NO_TIME,
};

export const getArrivalDateAndTimeAsString = (transfer: TransferDetails) => {
  return TransferArrivalDateAndTimes[
    transfer.status as unknown as ApianTransferStatusCodes
  ](transfer);
};

export const TransferArrivalDateAndTimes: TransferTime = {
  [ApianTransferStatusCodes.CREATED]: (transfer: TransferDetails) =>
    getScheduledArrivalIncDate(transfer),

  [ApianTransferStatusCodes.PENDING]: () => NO_TIME,
  [ApianTransferStatusCodes.CONFIRMED_BY_OPERATOR]: (
    transfer: TransferDetails
  ) => getScheduledArrivalIncDate(transfer),
  [ApianTransferStatusCodes.IN_TRANSIT_TO_DESTINATION]: (
    transfer: TransferDetails
  ) =>
    `est. ${getFormattedTableDateString(
      transfer.estimated_earliest_destination_arrival_time,
      true
    )}`,
  [ApianTransferStatusCodes.TRANSFER_COMPLETED]: (transfer: TransferDetails) =>
    getFormattedTableDateString(transfer.actual_destination_arrival_time, true),
  [ApianTransferStatusCodes.ORDER_CANCELLED]: () => NO_TIME,
  [ApianTransferStatusCodes.CANCELLED_BY_OPERATOR]: () => NO_TIME,
  [ApianTransferStatusCodes.REJECTED_BY_OPERATOR]: () => NO_TIME,
  [ApianTransferStatusCodes.TRANSFER_FAILED]: () => NO_TIME,
  [ApianTransferStatusCodes.FAILED_TO_CONNECT_TO_OPERATOR]: () => NO_TIME,
};

export const getClosestInflightTransfer = (transfers: Array<Transfer>) => {
  return [...transfers] // Creating a shallow copy of the array as .sort modifies original array
    .filter(
      (transfer) =>
        parseInt(transfer.status) ===
        ApianTransferStatusCodes.IN_TRANSIT_TO_DESTINATION
    )
    .sort((transferA, transferB) => {
      const dateA = new Date(
        transferA.destination_location.estimated_earliest_destination_arrival_time!
      );
      const dateB = new Date(
        transferB.destination_location.estimated_earliest_destination_arrival_time!
      );
      return isBefore(dateA, dateB) ? -1 : 1;
    })
    .at(0);
};

export const isCompleteOrInTransit = (transfer: Transfer | TransferDetails) => {
  return [
    ApianTransferStatusCodes.IN_TRANSIT_TO_DESTINATION,
    ApianTransferStatusCodes.TRANSFER_COMPLETED,
  ].includes(parseInt(transfer.status));
};

/**
 *
 * Gets the timestamp of a status in a tabletime format.
 * @param transfer
 * @param code
 * @returns time a
 */
export const getStatusTime = (
  transfer: TransferDetails,
  code: ApianTransferStatusCodes
) => {
  const statusItem = transfer.status_history.find(
    (item) => item.status === code.toString()
  );
  return getFormattedTableDateString(
    statusItem?.status_datetime,
    true,
    dayOrdinalShortMonthFormat
  );
};

/**
 * Helper function to find a specific status in a transfer's status history.
 *
 * @param transfer - The transfer details object.
 * @param status - The status code to search for.
 * @returns The status history item if found, otherwise undefined.
 */
export const getHistoryItem = (
  transfer: TransferDetails,
  status: ApianTransferStatusCodes
) => {
  return transfer.status_history.find(
    (historyItem) => historyItem.status === status.toString()
  );
};
