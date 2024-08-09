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

  const hospitalOptions = hospitals.map((hospital) =>
    hospital.shortName.toUpperCase(),
  );
  const values = transfers
    ?.map((transfer: any) => {
      const transferDetail = transferToTransferDetail(transfer);
      return [
        {
          value: transfer.source_location.shortName.toUpperCase(),
          options: hospitalOptions,
          mapper: (value: any) => value,
        },
        {
          value: transfer.destination_location.shortName.toUpperCase(),
          options: hospitalOptions,
          mapper: (value: any) => value,
        },
        ...getArrivalTimeAsString(transferDetail as unknown as TransferDetails)
          .replace("est.", "")
          .split("")
          .map((letter) => ({
            value: letter.toUpperCase(),
            options: LETTERS,
            mapper: (value: any) => value,
          })),
      ];
    })
    .slice(0, 10);

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
