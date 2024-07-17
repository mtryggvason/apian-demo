import { noDataMessage } from "@/components/tables/columns/TransferTableColumns";
import { ApianTransferStatusCodes } from "@/lib/constants/apianTransferStatuses";
import { NO_TIME } from "@/lib/constants/timeConstants";

import {
  getArrivalDateAndTimeAsString,
  getArrivalTimeAsString,
  getDepartureDateAndTimeAsString,
  getDepartureTimeAsString,
  getEstimatedArrivalTime,
  getScheduledArrival,
  getScheduledArrivalIncDate,
  getScheduledDepartureIncDate,
  TransferArrivalDateAndTimes,
  TransferArrivalTimes,
  TransferDepartureDateAndTimes,
  TransferDepartureTimes,
} from "./transferHelpers";

const baseMockTransfer = {
  code: ApianTransferStatusCodes.CREATED,
  scheduled_earliest_source_departure_time: "2022-01-01T12:00:00.000Z",
  scheduled_latest_source_departure_time: "2022-01-01T12:20:00.000Z",
  actual_source_departure_time: "2022-01-01T12:30:00.000Z",
  scheduled_earliest_destination_arrival_time: "2022-01-01T14:30:00.000Z",
  scheduled_latest_destination_arrival_time: "2022-01-01T14:50:00.000Z",
  actual_destination_arrival_time: "2022-01-01T14:50:00.000Z",
  estimated_earliest_destination_arrival_time: "2022-01-01T14:40:00.000Z",

  max_departure_wait_duration: 20,
};

describe("getDepartureTimeAsString", () => {
  it.each([
    ApianTransferStatusCodes.CANCELLED_BY_OPERATOR,
    ApianTransferStatusCodes.REJECTED_BY_OPERATOR,
    ApianTransferStatusCodes.FAILED_TO_CONNECT_TO_OPERATOR,
    ApianTransferStatusCodes.ORDER_CANCELLED,
  ])("returns NO_TIME for $status", (status) => {
    const cancelledTransfer = { ...baseMockTransfer, status };
    const result = getDepartureTimeAsString(cancelledTransfer);
    expect(result).toBe("12:00 - 12:20"); //show scheduled time
  });

  it.each([
    ApianTransferStatusCodes.CREATED,
    ApianTransferStatusCodes.CONFIRMED_BY_OPERATOR,
  ])(
    "returns formatted scheduled interval if status is CREATED or CONFIRMED_BY_OPERATOR",
    (status) => {
      const mockTransfer = {
        ...baseMockTransfer,
        status,
      };
      const result = getDepartureTimeAsString(mockTransfer);
      expect(result).toBe("12:00 - 12:20");
    },
  );

  it.each([
    ApianTransferStatusCodes.CREATED,
    ApianTransferStatusCodes.CONFIRMED_BY_OPERATOR,
  ])("returns est interval if there is an estimated time ", (status) => {
    const mock = {
      ...baseMockTransfer,
      status,
      estimated_earliest_source_departure_time: "2022-01-01T14:30:00.000Z",
      estimated_latest_source_departure_time: "2022-01-01T14:50:00.000Z",
    };
    const result = getDepartureTimeAsString(mock);
    expect(result).toBe("est. 14:30 - 14:50");
  });

  it.each([
    ApianTransferStatusCodes.TRANSFER_COMPLETED,
    ApianTransferStatusCodes.IN_TRANSIT_TO_DESTINATION,
    ApianTransferStatusCodes.TRANSFER_FAILED,
  ])(
    "returns actual departure time if complete or in transit_to_destination or transfer_failed",
    (status) => {
      const mock = { ...baseMockTransfer, status };
      const result = getDepartureTimeAsString(mock);
      expect(result).toBe("12:30");
    },
  );
});

describe("getArrivalTimeAsString", () => {
  it.each([
    ApianTransferStatusCodes.CANCELLED_BY_OPERATOR,
    ApianTransferStatusCodes.REJECTED_BY_OPERATOR,
    ApianTransferStatusCodes.FAILED_TO_CONNECT_TO_OPERATOR,
    ApianTransferStatusCodes.ORDER_CANCELLED,
    ApianTransferStatusCodes.TRANSFER_FAILED,
  ])("returns NO_TIME for $status", (status) => {
    const cancelledTransfer = { ...baseMockTransfer, status };
    const result = getArrivalTimeAsString(cancelledTransfer);
    expect(result).toBe(NO_TIME);
  });

  it.each([
    ApianTransferStatusCodes.CREATED,
    ApianTransferStatusCodes.CONFIRMED_BY_OPERATOR,
  ])("returns interval ", (status) => {
    const mock = { ...baseMockTransfer, status };

    const result = getArrivalTimeAsString(mock);
    expect(result).toBe("14:30 - 14:50");
  });

  it.each([
    ApianTransferStatusCodes.CREATED,
    ApianTransferStatusCodes.CONFIRMED_BY_OPERATOR,
  ])("returns est interval if there is an estimated time ", (status) => {
    const mock = {
      ...baseMockTransfer,
      status,
      estimated_earliest_destination_arrival_time: "2022-01-01T14:30:00.000Z",
      estimated_latest_destination_arrival_time: "2022-01-01T14:50:00.000Z",
    };

    const result = getArrivalTimeAsString(mock);
    expect(result).toBe("est. 14:30 - 14:50");
  });

  it.each([ApianTransferStatusCodes.IN_TRANSIT_TO_DESTINATION])(
    "returns est of transfer if it is in flight",
    (status) => {
      const transferWithoutActualTime = {
        ...baseMockTransfer,
        status,
      };
      const result = getArrivalTimeAsString(transferWithoutActualTime);
      expect(result).toBe("est. 14:40");
    },
  );

  it.each([ApianTransferStatusCodes.TRANSFER_COMPLETED])(
    "returns actual arrival time of transfer is completet",
    (status) => {
      const transferWithoutActualTime = {
        ...baseMockTransfer,
        status,
      };
      const result = getArrivalTimeAsString(transferWithoutActualTime);
      expect(result).toBe("14:50");
    },
  );
});

describe("the getScheduledDepartureIncDate() helper", () => {
  it("returns expected result with a scheduled departure date", () => {
    const result = getScheduledDepartureIncDate(baseMockTransfer);
    expect(result).toBe("1st Jan 2022, 12:00 - 12:20");
  });

  it("returns no data message without a scheduled departure time", () => {
    const mockData = { ...baseMockTransfer };
    delete mockData["scheduled_earliest_source_departure_time"];
    const result = getScheduledDepartureIncDate(mockData);
    expect(result).toBe(noDataMessage);
  });
});

describe("the getScheduledArrival() helper", () => {
  it("returns expected result with a scheduled_arrival_time", () => {
    const result = getScheduledArrival(baseMockTransfer);
    expect(result).toBe("14:30 - 14:50");
  });

  it("returns no data message without scheduled_arrival_time", () => {
    const mockData = { ...baseMockTransfer };
    delete mockData["scheduled_earliest_destination_arrival_time"];
    const result = getScheduledArrival(mockData);
    expect(result).toBe(noDataMessage);
  });
});

describe("the getScheduledArrivalIncDate() helper", () => {
  it("returns expected data with a scheduled_arrival_time", () => {
    const result = getScheduledArrivalIncDate(baseMockTransfer);
    expect(result).toBe("1st Jan 2022, 14:30 - 14:50");
  });

  it("returns no data message without scheduled_arrival_time", () => {
    const mockData = { ...baseMockTransfer };
    delete mockData["scheduled_earliest_destination_arrival_time"];
    const result = getScheduledArrivalIncDate(mockData);
    expect(result).toBe(noDataMessage);
  });
});

describe("the TransferDepartureTimes mapper function", () => {
  it("increases test coverage", () => {
    const result =
      TransferDepartureTimes[ApianTransferStatusCodes.PENDING](
        baseMockTransfer,
      );
    expect(result).toBe(NO_TIME);
  });
});

describe("the TransferArrivalTimes mapper function", () => {
  it("increases test coverage", () => {
    const result =
      TransferArrivalTimes[ApianTransferStatusCodes.PENDING](baseMockTransfer);
    expect(result).toBe(NO_TIME);
  });
});

describe("the getDepartureDateAndTimeAsString helper function", () => {
  it.each([
    {
      status: ApianTransferStatusCodes.CREATED,
      expected: "1st Jan 2022, 12:00 - 12:20",
    },
    { status: ApianTransferStatusCodes.PENDING, expected: NO_TIME },
    {
      status: ApianTransferStatusCodes.CONFIRMED_BY_OPERATOR,
      expected: "1st Jan 2022, 12:00 - 12:20",
    },
    {
      status: ApianTransferStatusCodes.IN_TRANSIT_TO_DESTINATION,
      expected: "1st Jan 2022, 12:30",
    },
    {
      status: ApianTransferStatusCodes.TRANSFER_COMPLETED,
      expected: "1st Jan 2022, 12:30",
    },
    { status: ApianTransferStatusCodes.ORDER_CANCELLED, expected: NO_TIME },
    {
      status: ApianTransferStatusCodes.CANCELLED_BY_OPERATOR,
      expected: NO_TIME,
    },
    {
      status: ApianTransferStatusCodes.REJECTED_BY_OPERATOR,
      expected: NO_TIME,
    },
    { status: ApianTransferStatusCodes.TRANSFER_FAILED, expected: NO_TIME },
    {
      status: ApianTransferStatusCodes.FAILED_TO_CONNECT_TO_OPERATOR,
      expected: NO_TIME,
    },
  ])("returns expected result with status $status", (data) => {
    const { status, expected } = data;
    const mockData = { ...baseMockTransfer, status: status };
    const result = getDepartureDateAndTimeAsString(mockData);
    expect(result).toBe(expected);
  });
});

describe("the TransferDepartureDateAndTimes mapper function", () => {
  it("increases test coverage", () => {
    const result =
      TransferDepartureDateAndTimes[ApianTransferStatusCodes.PENDING](
        baseMockTransfer,
      );
    expect(result).toBe(NO_TIME);
  });
});

describe("the getArrivalDateAndTimeAsString helper function", () => {
  it.each([
    {
      status: ApianTransferStatusCodes.CREATED,
      expected: "1st Jan 2022, 14:30 - 14:50",
    },
    { status: ApianTransferStatusCodes.PENDING, expected: NO_TIME },
    {
      status: ApianTransferStatusCodes.CONFIRMED_BY_OPERATOR,
      expected: "1st Jan 2022, 14:30 - 14:50",
    },
    {
      status: ApianTransferStatusCodes.IN_TRANSIT_TO_DESTINATION,
      expected: "est. 1st Jan 2022, 14:40",
    },
    {
      status: ApianTransferStatusCodes.TRANSFER_COMPLETED,
      expected: "1st Jan 2022, 14:50",
    },
    { status: ApianTransferStatusCodes.ORDER_CANCELLED, expected: NO_TIME },
    {
      status: ApianTransferStatusCodes.CANCELLED_BY_OPERATOR,
      expected: NO_TIME,
    },
    {
      status: ApianTransferStatusCodes.REJECTED_BY_OPERATOR,
      expected: NO_TIME,
    },
    { status: ApianTransferStatusCodes.TRANSFER_FAILED, expected: NO_TIME },
    {
      status: ApianTransferStatusCodes.FAILED_TO_CONNECT_TO_OPERATOR,
      expected: NO_TIME,
    },
  ])("returns expected result with status $status", (data) => {
    const { status, expected } = data;
    const mockData = { ...baseMockTransfer, status: status };
    const result = getArrivalDateAndTimeAsString(mockData);
    expect(result).toBe(expected);
  });
});

describe("the TransferArrivalDateAndTimes mapper function", () => {
  it("increases test coverage", () => {
    const result =
      TransferArrivalDateAndTimes[ApianTransferStatusCodes.PENDING](
        baseMockTransfer,
      );
    expect(result).toBe(NO_TIME);
  });
});

describe("The getEstimatedArrival() helper", () => {
  it.each([
    { transfer: baseMockTransfer, expected: "14:40" },
    {
      transfer: {
        ...baseMockTransfer,
        estimated_earliest_destination_arrival_time: "2024-01-01T00:00:00.000Z",
      },
      expected: "00:00",
    },
    {
      transfer: {
        ...baseMockTransfer,
        estimated_earliest_destination_arrival_time: "dummy_date",
      },
      expected: NO_TIME,
    },
  ])("returns expected result", (data) => {
    const { transfer, expected } = data;
    expect(getEstimatedArrivalTime(transfer)).toBe(expected);
  });
});
