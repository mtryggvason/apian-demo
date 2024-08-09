import { simpleCoord } from "@/lib/types/coordinates";
import { ApianTransferStatusCodes } from "../lib/constants/apianTransferStatuses";
import {
  Tracking,
  Transfer,
  TransferDetails,
  TransferTrackingResponse,
} from "../lib/types/transfer";
import { along, distance, length, lineString, point } from "@turf/turf";
import { add } from "date-fns";
import { simpleCoordToArray, simpleCoordToPoint } from "@/lib/mapHelpers";
import { getHospital, getSource } from "@/utils/hospitals";

export const TOTAL_DURATION = 60 * 10 * 1000;

function generateRandomDate(minMinutes: number, maxMinutes: number) {
  const now = new Date();
  const randomMinutes =
    Math.floor(Math.random() * (maxMinutes - minMinutes + 1)) + minMinutes;
  return new Date(now.getTime() + randomMinutes * 60000);
}

function generateUUID() {
  // Public Domain/MIT
  var d = new Date().getTime(); //Timestamp
  var d2 =
    (typeof performance !== "undefined" &&
      performance.now &&
      performance.now() * 1000) ||
    0; //Time in microseconds since page-load or 0 if unsupported
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = Math.random() * 16; //random number between 0 and 16
    if (d > 0) {
      //Use timestamp until depleted
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      //Use microseconds since page-load if supported
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

let transfers: Array<Transfer> = [];
let trackings: Array<TransferTrackingResponse> = [];
function generateObject(): Transfer {
  const senderHospital = getSource();
  const receiverHospital = getHospital(senderHospital.address);

  const distance = length(
    lineString([
      simpleCoordToPoint(senderHospital.coordinates) as any,
      simpleCoordToPoint(receiverHospital.coordinates),
    ]),
    { units: "kilometers" },
  );
  const now = new Date().toISOString();
  const scheduledEarliestSourceDepartureTime = generateRandomDate(
    1,
    10,
  ).toISOString();
  const scheduledLatestSourceDepartureTime = new Date(
    new Date(scheduledEarliestSourceDepartureTime).getTime() + 30 * 60000,
  ).toISOString();
  const actualSourceDepartureTime = add(new Date(), {
    minutes: -Math.random() * 2,
  }).toISOString();

  const scheduledEarliestDestinationArrivalTime = new Date(
    new Date(scheduledEarliestSourceDepartureTime).getTime() + 5 * 60000,
  ).toISOString();
  const scheduledLatestDestinationArrivalTime = new Date(
    new Date(scheduledEarliestDestinationArrivalTime).getTime() + 30 * 60000,
  ).toISOString();
  const estimatedEarliestDestinationArrivalTime = add(new Date(), {
    minutes: distance * 2,
  }).toISOString();
  const actualDestinationArrivalTime = add(new Date(), {
    minutes: distance * 2,
  });
  return {
    code: generateUUID(),
    status: "140",
    priority: "N",
    type: "3",
    operator: "290faf32-1192-4952-970e-2dc680ba0b29",
    operator_name: "Wing",
    source_location: {
      scheduled_earliest_source_departure_time:
        scheduledEarliestSourceDepartureTime,
      scheduled_latest_source_departure_time:
        scheduledLatestSourceDepartureTime,
      estimated_earliest_source_departure_time: null,
      estimated_latest_source_departure_time: null,
      actual_source_departure_time: actualSourceDepartureTime,
      ...senderHospital,
    },
    destination_location: {
      scheduled_earliest_destination_arrival_time:
        scheduledEarliestDestinationArrivalTime,
      scheduled_latest_destination_arrival_time:
        scheduledLatestDestinationArrivalTime,
      estimated_earliest_destination_arrival_time:
        estimatedEarliestDestinationArrivalTime,
      estimated_latest_destination_arrival_time: null,
      actual_destination_arrival_time: actualDestinationArrivalTime,
      ...receiverHospital,
    },
    max_departure_wait_duration: 30,
    shipment_list: [
      {
        shipment_code: "ba80180d-48c0-487d-ad3e-74bf84639d8f",
      },
    ],
  } as any;
}

export const getTransfers = () => {
  while (transfers.length < 10) {
    transfers.push(generateObject());
  }
  transfers.forEach((transfer) => {
    const trackingExists = trackings.find((t) => t.code === transfer.code);
    if (!trackingExists) {
      const tracking = {
        code: transfer.code,
        status: transfer.status,
        responseValid: "",
        tracking: {
          id: 0,
          startTime: 0,
          current_velocity: 0,
          current_heading: 0,
          current_position: transfer.source_location.coordinates,
          flight_path_coordinates: [
            simpleCoordToArray(transfer.source_location.coordinates),
          ],
          last_polling_time: "",
        },
      };
      trackings.push(tracking as any);
    }
  });
  const newTransfers = transfers.map((t) => ({ ...t }));
  return [...newTransfers];
};

export function filterPastTransfers(transfers: Array<Transfer>) {
  const now = new Date();

  return transfers.map((transfer: Transfer) => {
    const transferClone = { ...transfer };
    if (transfer.destination_location.actual_destination_arrival_time) {
      const actualDestinationArrivalTime = new Date(
        transfer.destination_location.actual_destination_arrival_time,
      );
      transferClone.status = ApianTransferStatusCodes.TRANSFER_COMPLETED;
    }
    return transferClone;
  });
}

function calculatePosition(
  startTime: number,
  totalDuration: number,
  startLocation: simpleCoord,
  endLocation: simpleCoord,
  currentTime: number,
) {
  // Calculate the total duration and elapsed time in milliseconds
  let elapsedTime = currentTime - startTime;

  // Ensure elapsed time is not greater than total duration
  if (elapsedTime > totalDuration) {
    elapsedTime = totalDuration;
  }

  // Calculate the fraction of the journey completed
  const fractionCompleted = elapsedTime / totalDuration;
  // Use Turf.js to calculate the interpolated position
  const start = simpleCoordToPoint(startLocation as any);
  const end = simpleCoordToPoint(endLocation as any);
  const line = lineString([start as any, end as any]);
  const interpolatedPosition = along(line, fractionCompleted * length(line))
    .geometry.coordinates;

  return interpolatedPosition;
}

export const getPercentageComplete = (transfer: TransferDetails) => {
  const totalDuration =
    new Date(
      transfer.destination_location.estimated_earliest_destination_arrival_time!,
    ).getTime() -
    new Date(transfer.source_location.actual_source_departure_time!).getTime();
  const startTime = new Date(
    transfer.source_location.actual_source_departure_time!,
  ).getTime();
  const currentTime = new Date().getTime();
  const elapsedTime = currentTime - startTime;
  return elapsedTime / totalDuration;
};

export const getTimeRemaining = (transfer: TransferDetails) => {
  const totalDuration =
    new Date(
      transfer.destination_location.estimated_earliest_destination_arrival_time!,
    ).getTime() -
    new Date(transfer.source_location.actual_source_departure_time!).getTime();
  const startTime = new Date(
    transfer.source_location.actual_source_departure_time!,
  ).getTime();
  const currentTime = new Date().getTime();
  const elapsedTime = currentTime - startTime;
  return Math.ceil((totalDuration - elapsedTime) / 60000);
};

export const getDistanceRemaining = (transfer: TransferDetails) => {
  const tracking = trackings.find(
    (tracking) => tracking.code === transfer.code,
  );

  if (!tracking) return 0;
  return length(
    lineString([
      simpleCoordToPoint(tracking?.tracking?.current_position!) as any,
      simpleCoordToPoint(transfer.destination_location.coordinates),
    ]),
    { units: "kilometers" },
  );
};

const updateTracking = (
  tracking: TransferTrackingResponse,
  transfer: Transfer,
) => {
  if (
    new Date(transfer.source_location.actual_source_departure_time!).getTime() <
    new Date().getTime()
  ) {
    tracking.status = ApianTransferStatusCodes.IN_TRANSIT_TO_DESTINATION;
  }

  if (
    new Date(
      transfer.destination_location.estimated_earliest_destination_arrival_time!,
    ).getTime() < new Date().getTime()
  ) {
    tracking.status = ApianTransferStatusCodes.TRANSFER_COMPLETED;
  }

  const currentPosition = calculatePosition(
    new Date(transfer.source_location.actual_source_departure_time!).getTime(),
    new Date(
      transfer.destination_location.estimated_earliest_destination_arrival_time!,
    ).getTime() -
      new Date(
        transfer.source_location.actual_source_departure_time!,
      ).getTime(),
    transfer.source_location.coordinates,
    transfer.destination_location.coordinates,
    new Date().getTime(),
  );
  tracking.tracking!.current_position = {
    lon: currentPosition[0],
    lat: currentPosition[1],
  };
  tracking.tracking!.flight_path_coordinates.push(currentPosition);
  return { ...tracking };
};

export const updateTrackings = () => {
  transfers.forEach((transfer) => {
    trackTransfer(transfer.code);
  });
  transfers = transfers.filter((transfer) => transfer.status === "140");
  console.log(transfers);
};

export const getTrackings = () => {
  const newTrackings = trackings.map((tracking: TransferTrackingResponse) => ({
    ...tracking,
  }));
  return [...newTrackings];
};

export const getClosestTracking = (location: simpleCoord) => {
  let trackingID: string;
  trackings.reduce((previous: number, tracking) => {
    const distance = length(
      lineString([
        simpleCoordToArray(tracking.tracking?.current_position!),
        simpleCoordToArray(location),
      ]),
      { units: "kilometers" },
    );
    if (distance < previous) {
      trackingID = tracking.code;
    }
    return Math.min(previous, distance);
  }, Infinity);
  return trackings.find((tr) => tr.code === trackingID);
};

export const trackTransfer = (code: string) => {
  const transfer = transfers.find((transfer) => transfer.code === code);
  const tracking = trackings.find((tracking) => tracking.code === code);
  if (transfer && tracking) {
    updateTracking(tracking, transfer);
    trackings = trackings.filter((t) => t.code !== code);
    trackings = [...trackings, tracking];
  }
  return tracking;
};

export const transferToTransferDetail = (transfer: Transfer) => {
  return {
    estimated_earliest_source_departure_time:
      transfer.source_location.estimated_earliest_source_departure_time,
    estimated_latest_source_departure_time:
      transfer.source_location.estimated_latest_source_departure_time,
    actual_source_departure_time:
      transfer.source_location.actual_source_departure_time,
    scheduled_earliest_source_departure_time:
      transfer.source_location.scheduled_earliest_source_departure_time,
    scheduled_latest_source_departure_time:
      transfer.source_location.scheduled_latest_source_departure_time,
    actual_destination_arrival_time:
      transfer.destination_location.actual_destination_arrival_time,
    scheduled_latest_destination_arrival_time:
      transfer.destination_location.scheduled_latest_destination_arrival_time,
    scheduled_earliest_destination_arrival_time:
      transfer.destination_location.scheduled_earliest_destination_arrival_time,
    estimated_earliest_destination_arrival_time:
      transfer.destination_location.estimated_earliest_destination_arrival_time,
    estimated_latest_destination_arrival_time:
      transfer.destination_location.estimated_latest_destination_arrival_time,
    ...transfer,
  };
};

function getNextStatus(
  currentStatus: ApianTransferStatusCodes,
): ApianTransferStatusCodes | null {
  const statuses = [
    ApianTransferStatusCodes.CREATED,
    ApianTransferStatusCodes.PENDING,
    ApianTransferStatusCodes.CONFIRMED_BY_OPERATOR,
    ApianTransferStatusCodes.IN_TRANSIT_TO_DESTINATION,
    ApianTransferStatusCodes.TRANSFER_COMPLETED,
    // Exclude cancelled and failed statuses
  ];

  const currentIndex = statuses.indexOf(currentStatus);

  if (currentIndex >= 0 && currentIndex < statuses.length - 1) {
    return statuses[currentIndex + 1];
  }

  // Return null if there's no next status
  return currentStatus;
}

export function updateTransferStatus(
  transferCode: string,
  transfers: Array<any>,
) {
  // Find the transfer by its code
  const transferIndex = transfers.findIndex(
    (transfer) => transfer.code === transferCode,
  );

  // If the transfer is found
  if (transferIndex !== -1) {
    const transfer = transfers[transferIndex];

    // Get the next status based on the current status
    const nextStatus = getNextStatus(transfer.status);

    // If there is a next status, update the transfer's status
    if (nextStatus !== null) {
      // Create a new transfer object with the updated status
      const updatedTransfer = {
        ...transfer,
        status: nextStatus.toString(),
      };

      // Replace the old transfer with the updated one in the new transfers array
      const updatedTransfers = [
        ...transfers.slice(0, transferIndex),
        updatedTransfer,
        ...transfers.slice(transferIndex + 1),
      ];

      // Return the new transfers array with the updated transfer
      return updatedTransfers;
    }
    return transfers;
  }
}
