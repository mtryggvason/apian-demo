import { Board, LETTERS } from "@/components/Board";
import { ScaleToFitWidth } from "@/components/scaleToFitWidth";
import {
  getTransfers,
  transferToTransferDetail,
  updateTransferStatus,
} from "@/utils/transferGenerator";
import useSWR from "swr";
import {
  getArrivalTimeAsString,
  getDepartureTimeAsString,
} from "@/lib/transferHelpers";
import { Transfer, TransferDetails } from "@/lib/types/transfer";
import { APIANIcon } from "@/components/icons/ApianLogo";
import { useState } from "react";
import { useEventListener, useInterval } from "usehooks-ts";
import { hospitals, sources } from "@/utils/hospitals";
import {
  ApianTransferStatusCodes,
  upcomingTransferStatus,
} from "@/lib/constants/apianTransferStatuses";
import { HollowPoint } from "@/components/icons/hollowPoint";
import { BoardDrone } from "@/components/icons/BoardDrone";
import { SolidPoint } from "@/components/icons/SolidPoint";

/*
  CREATED = 100,
  PENDING = 110,
  CONFIRMED_BY_OPERATOR = 130,
  IN_TRANSIT_TO_DESTINATION = 140,
  TRANSFER_COMPLETED = 200,
*/

function mapTransferStatusToCode(status: ApianTransferStatusCodes): number[] {
  switch (status) {
    case ApianTransferStatusCodes.CREATED:
    case ApianTransferStatusCodes.PENDING:
      return [0, 0, 0];
    case ApianTransferStatusCodes.CONFIRMED_BY_OPERATOR:
      return [1, 0, 0];
    case ApianTransferStatusCodes.IN_TRANSIT_TO_DESTINATION:
      return [2, 1, 0];
    case ApianTransferStatusCodes.TRANSFER_COMPLETED:
      return [2, 2, 2];
    default:
      // Ignoring all cancelled and failed statuses
      return [];
  }
}

const statusSymbols = [
  <div className="flex mt-[0.2em] justify-center" key={1}>
    <HollowPoint width="0.5em" />
  </div>,
  <div className="flex  justify-center" key={2}>
    <BoardDrone key={2} width="0.8em" />
  </div>,
  <div className="flex mt-[0.2em] justify-center" key={3}>
    <SolidPoint width="0.5em" />
  </div>,
];

export function DepartureBoard({}) {
  const [render, setRender] = useState(false);
  const [transfers, setTransfers] = useState<any>(getTransfers());

  const hospitalOptions = hospitals.map((hospital) => hospital.name);
  const sourceOptions = sources.map((hospital) => hospital.name);

  const longesHospitalName = hospitals.reduce((prev, hospital) => {
    return Math.max(prev, hospital.shortName.length + 1);
  }, 0);

  const longestSourceName = sources.reduce((prev, source) => {
    return Math.max(prev, source.shortName.length + 1);
  }, 0);

  const handleSpacebarPress = (event: KeyboardEvent) => {
    if (event.code === "Space") {
      const transfer = transfers
        .filter(
          (t: Transfer) =>
            t.status !== ApianTransferStatusCodes.TRANSFER_COMPLETED,
        )
        .at(0) as Transfer;
      if (transfer) {
        setTransfers(updateTransferStatus(transfer.code, transfers));
      }
    }
  };
  useEventListener("keydown", handleSpacebarPress);

  const sortedTransfers = transfers.sort((a: Transfer, b: Transfer) => {
    // If a is Complete and b is not, a should come after b
    if (
      a.status == (ApianTransferStatusCodes.TRANSFER_COMPLETED as any) &&
      b.status != (ApianTransferStatusCodes.TRANSFER_COMPLETED as any)
    ) {
      return 1;
    }
    // If b is Complete and a is not, b should come after a
    if (
      b.status == (ApianTransferStatusCodes.TRANSFER_COMPLETED as any) &&
      a.status != (ApianTransferStatusCodes.TRANSFER_COMPLETED as any)
    ) {
      return -1;
    }
    // If both are Complete or both are not, maintain the original order
    return 0;
  });

  const startLocations = sortedTransfers?.map((transfer: any) => {
    return `${transfer.source_location.shortName.padEnd(
      longestSourceName,
      " ",
    )}`
      .split("")
      .map((letter) => ({
        value: letter.toUpperCase(),
        options: LETTERS,
        mapper: (value: any) => value,
      }));
  });

  const endLocations = sortedTransfers?.map((transfer: any) => {
    return `${transfer.destination_location.shortName.padEnd(
      longesHospitalName,
      " ",
    )}`
      .split("")
      .map((letter) => ({
        value: letter.toUpperCase(),
        options: LETTERS,
        mapper: (value: any) => value,
      }));
  });

  const departureTimes = sortedTransfers?.map((transfer: any) => {
    const transferDetail = transferToTransferDetail(transfer);
    return `${getArrivalTimeAsString(
      transferDetail as unknown as TransferDetails,
    ).replace("est. ", "")}`
      .split("")
      .map((letter) => ({
        value: letter.toUpperCase(),
        options: LETTERS,
        mapper: (value: any) => value,
      }));
  });

  const statuses = sortedTransfers?.map((transfer: any) => {
    return mapTransferStatusToCode(transfer.status).map((number) => ({
      value: number,
      options: [-1, 0, 1, 2],
      mapper: (value: any) => {
        return statusSymbols[value];
      },
    }));
  });

  return (
    <div className="p-4  min-h-screen w-screen bg-board-black border-black border-4 overflow-hidden">
      <APIANIcon className="w-[200px] mb-4"></APIANIcon>
      <ScaleToFitWidth>
        <div className="flex flex-row align-top">
          <div className="mr-2">
            <h2 className="text-white uppercase">From</h2>
            <Board
              letterCount={longestSourceName}
              rowCount={10}
              value={startLocations as any}
            />
          </div>
          <div className="mr-2">
            <h2 className="text-white uppercase">To</h2>
            <Board
              letterCount={longesHospitalName}
              rowCount={10}
              value={endLocations as any}
            />
          </div>
          <div className="mr-2">
            <h2 className="text-white uppercase">Dep. Time</h2>
            <Board
              letterCount={5}
              rowCount={10}
              value={departureTimes as any}
            />
          </div>
          <div>
            <h2 className="text-white uppercase">Status</h2>
            <Board letterCount={3} rowCount={10} value={statuses as any} />
          </div>
        </div>
      </ScaleToFitWidth>
    </div>
  );
}
