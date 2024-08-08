import { Board, LETTERS } from "@/components/Board";
import { ScaleToFitWidth } from "@/components/scaleToFitWidth";
import {
  getTransfers,
  transferToTransferDetail,
} from "@/utils/transferGenerator";
import useSWR from "swr";
import {
  getArrivalTimeAsString,
  getDepartureTimeAsString,
} from "@/lib/transferHelpers";
import { TransferDetails } from "@/lib/types/transfer";
import { APIANIcon } from "@/components/icons/ApianLogo";
import { useState } from "react";
import { useInterval } from "usehooks-ts";
import { hospitals } from "@/utils/hospitals";

export function DepartureBoard({}) {
  const [render, setRender] = useState(false);

  const {
    data: transfers,
    error,
    isLoading,
  } = useSWR(
    "/api/user/123",
    () => {
      return getTransfers();
    },
    {
      refreshInterval: 15000,
    },
  );

  if (isLoading) return null;

  const hospitalOptions = hospitals.map((hospital) => hospital.name);
  const longesHospitalName = hospitals.reduce((prev, hospital) => {
    return Math.max(prev, hospital.shortName.length);
  }, 0);

  const values = transfers?.map((transfer: any) => {
    const transferDetail = transferToTransferDetail(transfer);
    return `${transfer.source_location.shortName.padEnd(
      longesHospitalName,
      " ",
    )} - ${transfer.destination_location.shortName.padEnd(
      longesHospitalName,
      " ",
    )} ${getArrivalTimeAsString(
      transferDetail as unknown as TransferDetails,
    ).replace("est. ", "")}  IN-FLIGHT`
      .split("")
      .map((letter) => ({
        value: letter.toUpperCase(),
        options: LETTERS,
      }));
  });
  console.log(values);

  return (
    <div className="p-4  min-h-screen w-screen bg-board-black border-black border-4 overflow-hidden">
      <APIANIcon className="w-[150px] mb-4"></APIANIcon>
      <ScaleToFitWidth>
        <Board rowCount={10} value={values as any} />
      </ScaleToFitWidth>
    </div>
  );
}

const VanillaBoard = () => {};
