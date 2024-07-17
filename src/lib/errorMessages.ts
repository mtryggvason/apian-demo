export const NO_SENDER_ERROR_MSG = "No sender selected";

export const NO_RECIPIENT_ERROR_MSG = "No recipient selected";

export const NO_DATE_TIME_ERROR_MSG = "No order time selected";

export const DATE_IN_PAST_ERROR_MSG = "Scheduled order time is in the past";

export const SENDER_RECIPIENT_EQUAL_ERROR_MSG =
  "Sender and recipient must be different";

export const INVALID_DATE_ERROR_MSG = "Invalid date format";

export const FIELD_REQUIRED_ERROR_MSG = "Field is required.";

export const ITEMS_MIN_ERROR_MSG = "Minimum quantity for this item is 1";
export const ITEMS_MAX_ERROR_MSG = "Maximum quantity for this item is 50";
export const RECURRING_INT_MIN_ERROR_MSG = (timeUnit: string) => {
  return `Minimum interval for duplicate orders is 1 ${timeUnit}`;
};
export const RECURRING_INT_MAX_ERROR_MSG = (timeUnit: string) => {
  return `Maximum interval for duplicate orders is 10 ${timeUnit}`;
};
export const RECURRING_COUNT_MIN_ERROR_MSG =
  "Minimum number of duplicate orders is 0";
export const RECURRING_COUNT_MAX_ERROR_MSG =
  "Maximum number of duplicate orders is 10";
export const RECURRING_FREQ_ERROR_MSG =
  "No time interval selected for duplicate orders";

export const SCHEDULED_REC_ORDERS_ERROR_MSG =
  "Orders can only be scheduled for pickup from this sender between";
export const SCHEDULED_REC_ORDERS_ONE_ERROR_MSG =
  "duplicate order is outside this time window";
export const SCHEDULED_REC_ORDERS_MULTIPLE_ERROR_MSG =
  "duplicate orders are outside of this time window";

export const DAY_CONSTRAINT_ERROR_MSG =
  "Orders can only be scheduled for pickup up to 14 days ahead";

export const STATS_CARD_ERROR_MSG = "Error fetching data";
