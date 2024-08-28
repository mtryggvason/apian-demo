import { Board, LETTERS, NUMBERS } from "@/components/Board";
import { ScaleToFitWidth } from "@/components/scaleToFitWidth";
import {
  getTransfers,
  transferToTransferDetail,
  updateTransferStatus,
} from "@/utils/transferGenerator";
import {
  getArrivalTimeAsString,
} from "@/lib/transferHelpers";
import { Transfer, TransferDetails } from "@/lib/types/transfer";
import { APIANIcon } from "@/components/icons/ApianLogo";
import { useState } from "react";
import { useEventListener, useInterval } from "usehooks-ts";
import { hospitals, sources } from "@/utils/hospitals";
import {
  ApianTransferStatusCodes,
} from "@/lib/constants/apianTransferStatuses";
import { HollowPoint } from "@/components/icons/hollowPoint";
import { BoardDrone } from "@/components/icons/BoardDrone";
import { SolidPoint } from "@/components/icons/SolidPoint";
import { formatWithDefaultTimeZone } from "@/lib/dateHelpers";
import { TwentyFourHourFormat } from "@/lib/constants/timeConstants";

/*
  CREATED = 100,
  PENDING = 110,
  CONFIRMED_BY_OPERATOR = 130,
  IN_TRANSIT_TO_DESTINATION = 140,
  TRANSFER_COMPLETED = 200,
*/


export function DepartureBoard({}) {
  const [transfers, setTransfers] = useState<any>(getTransfers());
  const [time, setTime] = useState(new Date())
  useInterval(() => {
    setTime(new Date());
  }, 60000);
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
    return (
      new Date(
        a.destination_location.estimated_earliest_destination_arrival_time!,
      ).getTime() -
      new Date(
        b.destination_location.estimated_earliest_destination_arrival_time!,
      ).getTime()
    );
  });

  const startLocations = sortedTransfers?.map((transfer: any) => {
    return `${transfer.source_location.shortName.padEnd(
      longestSourceName + 1,
      " ",
    )}`
      .split("")
      .map((letter) => ({
        value: letter.toUpperCase(),
        options: LETTERS,
        mapper: (value: any) => <span className="text-[#FCFF39]">{value}</span>,
      }));
  });

  const endLocations = sortedTransfers?.map((transfer: any) => {
    return `${transfer.destination_location.shortName.padEnd(
      longesHospitalName + 1,
      " ",
    )}`
      .split("")
      .map((letter) => ({
        value: letter.toUpperCase(),
        options: LETTERS,
        mapper: (value: any) => <span className="flex justify-center text-[#FCFF39]">{value}</span>,
      }));
  });

  const departureTimes = sortedTransfers?.map((transfer: any) => {
    const transferDetail = transferToTransferDetail(transfer);
    return `${getArrivalTimeAsString(
      transferDetail as unknown as TransferDetails,
    )
    .replace("est. ", "")}`
    .padEnd(6, " ")
      .split("")
      .map((letter) => ({
        value: letter.toUpperCase(),
        options: LETTERS,
        mapper: (value: any) => <span className="text-[#FCFF39]">{value}</span>,
      }));
  });

  const randomStatus = () => {
    const statuses = ["Scheduled", "In transit", "Delivered"];
    return (statuses[(Math.floor(Math.random() * statuses.length))]);
  }

  const getStatusColor = (status: string) => {
    if(status === "Scheduled") {
      return "#FCFF39"
    }
    return "#56D85E"
  }
  const statuses = sortedTransfers?.map((transfer: any) => {
    const status = randomStatus()
    return `${status.padEnd(
      10,
      " ",
    )}`
      .split("")
      .map((letter) => ({
        value: letter.toUpperCase(),
        options: LETTERS,
        mapper: (value: any) => <span style={{"color": getStatusColor(status)}}>{value}</span>,
      }));
  });

  const clock = [""].map((transfer: any) => {
    const value = formatWithDefaultTimeZone(time, TwentyFourHourFormat)
    return `${value}`
      .split("")
      .map((letter) => ({
        value: letter.toUpperCase(),
        options: NUMBERS,
        mapper: (value: any) => <span className="text-[#FCFF39]">{value}</span>,
      }));
  });
  return (
    <div className="min-h-screen w-screen bg-black overflow-x-hidden  p-4">
      <ScaleToFitWidth>
          <div className="flex justify-between items-start">
            <APIANIcon className="w-[110px] mb-4 "></APIANIcon>
            <Board
                letterCount={4}
                rowCount={1}
                value={clock as any}
              />
          </div>
          <div className="flex flex-row align-top relative z-20">
          <div className="">
              <h2 className="text-white uppercase font-normal font-oswald text-sm   mb-1">
                Dep. Time
              </h2>
              <Board
                letterCount={5}
                rowCount={10}
                value={departureTimes as any}
              />
            </div>
            <div className="">
              <h2 className="text-white uppercase font-normal font-oswald text-sm  mb-1">
                From
              </h2>
              <Board
                letterCount={longestSourceName}
                rowCount={10}
                value={startLocations as any}
              />
            </div>
            <div className="">
              <h2 className="text-white uppercase font-normal font-oswald text-sm mb-1">
                Destination
              </h2>
              <Board
                letterCount={longesHospitalName}
                rowCount={10}
                value={endLocations as any}
              />
            </div>

            <div>
              <h2 className="text-white uppercase font-normal font-oswald  text-sm  mb-1">
                Remarks
              </h2>
              <Board letterCount={3} rowCount={10} value={statuses as any} />
            </div>
          </div>
      </ScaleToFitWidth>
    </div>
  );
}
