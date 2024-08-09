export enum ApianTransferStatusCodes {
  CREATED = "100",
  PENDING = "110",
  CONFIRMED_BY_OPERATOR = "130",
  IN_TRANSIT_TO_DESTINATION = "140",
  TRANSFER_COMPLETED = "200",
  ORDER_CANCELLED = "300",
  CANCELLED_BY_OPERATOR = "310",
  REJECTED_BY_OPERATOR = "400",
  TRANSFER_FAILED = "500",
  FAILED_TO_CONNECT_TO_OPERATOR = "501",
}

export type UnsuccessfulStatusCodes =
  | ApianTransferStatusCodes.ORDER_CANCELLED
  | ApianTransferStatusCodes.CANCELLED_BY_OPERATOR
  | ApianTransferStatusCodes.REJECTED_BY_OPERATOR
  | ApianTransferStatusCodes.TRANSFER_FAILED
  | ApianTransferStatusCodes.FAILED_TO_CONNECT_TO_OPERATOR;

export const upcomingTransferStatus = [
  ApianTransferStatusCodes.CONFIRMED_BY_OPERATOR,
  ApianTransferStatusCodes.CREATED,
  ApianTransferStatusCodes.IN_TRANSIT_TO_DESTINATION,
  ApianTransferStatusCodes.PENDING,
];

export const nonPolledTransferStatuses = [
  ApianTransferStatusCodes.TRANSFER_COMPLETED,
  ApianTransferStatusCodes.ORDER_CANCELLED,
  ApianTransferStatusCodes.CANCELLED_BY_OPERATOR,
  ApianTransferStatusCodes.REJECTED_BY_OPERATOR,
  ApianTransferStatusCodes.TRANSFER_FAILED,
  ApianTransferStatusCodes.FAILED_TO_CONNECT_TO_OPERATOR,
];

export const transferHistoryStatusStrings: Record<
  ApianTransferStatusCodes,
  string
> = {
  [ApianTransferStatusCodes.CREATED]: "Created",
  [ApianTransferStatusCodes.PENDING]: "Pending",
  [ApianTransferStatusCodes.CONFIRMED_BY_OPERATOR]: "Confirmed by operator",
  [ApianTransferStatusCodes.IN_TRANSIT_TO_DESTINATION]:
    "In transit to destination",
  [ApianTransferStatusCodes.TRANSFER_COMPLETED]: "Transfer complete",
  [ApianTransferStatusCodes.ORDER_CANCELLED]: "Order cancelled",
  [ApianTransferStatusCodes.CANCELLED_BY_OPERATOR]: "Cancelled by operator",
  [ApianTransferStatusCodes.REJECTED_BY_OPERATOR]: "Rejected by operator",
  [ApianTransferStatusCodes.TRANSFER_FAILED]: "Transfer failed",
  [ApianTransferStatusCodes.FAILED_TO_CONNECT_TO_OPERATOR]:
    "Failed to connect to operator",
};

export const mainStatuses = [
  ApianTransferStatusCodes.CREATED,
  ApianTransferStatusCodes.CONFIRMED_BY_OPERATOR,
  ApianTransferStatusCodes.IN_TRANSIT_TO_DESTINATION,
  ApianTransferStatusCodes.TRANSFER_COMPLETED,
] as const;
